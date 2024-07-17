import { useEffect, useState, useRef } from "react";
import "../styles/Chatbox.css";
import axios from "axios";
import closeButton from "../assets/closebutton.png";
import sendButton from "../assets/send.png";
import { findNewDays, renameDay } from "./fixDays";

export default function Chatbox({ chatInformation, handleCloseChat, sortConversationsAgain, socket}) {
  const [isLoading, setIsLoading] = useState(true);
  const [messagesArray, setMessagesArray] = useState([]);
  const storedToken = localStorage.getItem("authToken");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const lastMessages = 30;
  const [isOtherOnline, setIsOtherOnline] = useState(false);


  useEffect(() => {

    if (chatInformation.idConversation === undefined) {
      console.log("idConversation empty, so we don´t run de useEffect")
      return
    }

    const handleCheckOtherOnline = (originId) => {
      console.log("Evento check-online recibido")
      if (originId === chatInformation.idOther) {
        console.log("Cambiando a true")
        setIsOtherOnline(true);
        console.log("Avisar de vuelta que sí estoy conectado");
        socket.emit('other is online', chatInformation.idOther, chatInformation.idMe)
      }
    }
  
    const handleConfirmOtherOnline = (originId) => {
      console.log("Recibo que el otro está en línea")
      if (originId === chatInformation.idOther) {
        console.log("Cambiando a true")
        setIsOtherOnline(true);
      }
    }
    const handleOtherLeftChat = (originId) => {
      if (originId === chatInformation.idOther) {
        console.log("El otro usuario se marchó. Cambiando a false")
        setIsOtherOnline(false);
      }
    }
  
    const handleNewMessage = (originId) => {
      if (originId === chatInformation.idOther) {
      console.log("Got message");
      setFetchAgain(prev => !prev);
      }
    };
  
    const handleUserTyping = (originId) => {
      if (originId === chatInformation.idOther) {
        timerTyping();
      }
    }
    
    socket.emit('join-chat', chatInformation.idOther, chatInformation.idMe);
    
    // Event Listeners
    socket.on("check-other-online", handleCheckOtherOnline);
    socket.on("confirm other online", handleConfirmOtherOnline)
    socket.on("other left chat", handleOtherLeftChat)
    socket.on('new message', handleNewMessage);
    socket.on('user typing', handleUserTyping);

    // Cleaning events and leaving-chat
    return () => {
      console.log("executing leave-chat and clean events");
      socket.emit('leave-chat', chatInformation.idOther, chatInformation.idMe);
      socket.off("check-other-online", handleCheckOtherOnline);
      socket.off("confirm other online", handleConfirmOtherOnline)
      socket.off("other left chat", handleOtherLeftChat)
      socket.off('new message', handleNewMessage);
      socket.off('user typing', handleUserTyping);
    };
  }, [ chatInformation.idConversation, socket, chatInformation.idMe, chatInformation.idOther]);

  function timerTyping() {
    setTypingEffect(true)
    setTimeout( () => {
      setTypingEffect(false)
    } , 2000)

  }

  function isTyping() {
    socket.emit('user typing', chatInformation.idOther, chatInformation.idMe)
  }

  function sendMessageToSocket (newMessage) {
    socket.emit('new message', chatInformation.idOther, chatInformation.idMe)
  } 

  useEffect( () => {
    console.log("fetching again")
    if (chatInformation.idConversation !== undefined)
    { 
      const numberRequestedMessages = lastMessages + chatInformation.notifications;
      axios.get(`${import.meta.env.VITE_API_URL}/conversation/messages/${chatInformation.idConversation}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
        params: {
          numberRequestedMessages: numberRequestedMessages
        }
      })
      .then( (response) => {      
        setMessagesArray(findNewDays(response.data))
        setIsLoading(false)
      })
      .catch( error => {
        console.log(error)
      })
    }
    
    else {
    setIsLoading(false)
    }
  }, [fetchAgain, chatInformation])

  function handleSendMessage(e) {
    e.preventDefault();
    const textareaValue = document.getElementById('write-message').value; 
    if (textareaValue.length === 0 ) {return}
    const newMessage = {
        sender: chatInformation.idMe,
        content: textareaValue
      }
    
    if (chatInformation.idConversation === undefined) {
      createChat(newMessage)
    } else {
      sendMessage(newMessage)
    }
  }

  //Creates a new chat and, if succesfull, invokes updateUsers
  function createChat(newMessage) {
    const body = {
      participants: [chatInformation.idMe, chatInformation.idOther],
      messages: [newMessage]
      }
    axios.post(`${import.meta.env.VITE_API_URL}/conversation/create-conversation`, body, 
    { headers: { Authorization: `Bearer ${storedToken}`} }
    )
    .then ( response => {
      const newCreatedMessage = (response.data.messages[0]);
      const conversationId = response.data._id;
      updateUsers(conversationId, newCreatedMessage);
    })
    .catch (error => {
      console.log(error)
    })
  }

  //If create-conversation is sucesfull: adds the newly created conversation to the corresponding users
  function updateUsers (conversationId, newMessage) {
    const body = {
      userId: chatInformation.idMe,
      userId2: chatInformation.idOther,
      conversationId: conversationId
    }
    axios.put(`${import.meta.env.VITE_API_URL}/user/add-conversation`, body, 
    { headers: { Authorization: `Bearer ${storedToken}`} }
    )
    .then( response => {
      chatInformation.idConversation = conversationId;
      realTimeMessageLogic(newMessage, true); 
    } )
    .catch( error => {
      console.log(error)
    })
  }

  function realTimeMessageLogic(newMessage, IsNewChat) {
    document.getElementById('write-message').value = '';
    setFetchAgain(!fetchAgain);
    sortConversationsAgain( chatInformation.idConversation, new Date().toISOString(), IsNewChat, chatInformation)   
    console.log("Other online?", isOtherOnline)
    if (isOtherOnline) {
      console.log("sending to socket")
      sendMessageToSocket(newMessage);
    } else {
      console.log("sending notification")
      sendNotification(newMessage)}
  }

  function sendMessage(newMessage) {
    axios.put(`${import.meta.env.VITE_API_URL}/conversation/createMessage/${chatInformation.idConversation}`, newMessage,
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
    .then( () => {
      realTimeMessageLogic(newMessage, false)
    })
    .catch( error => {
      console.log(error)
    })
  }

  function sendNotification(newMessage) {
    console.log("This should show only if the other user is not in the same chatroom")
    const body = {idOrigin: chatInformation.idConversation, notificationType: "message"};
    axios.put(`${import.meta.env.VITE_API_URL}/user/add-notification/${chatInformation.idOther}`, body, 
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
    .then ( response => {

      console.log("Sending notification to socket")
      socket.emit('sendNotification', 
        {
          idConversation: chatInformation.idConversation,
          senderId: chatInformation.idMe,
          recipientId: chatInformation.idOther,
          message: newMessage
        }
      );
    })
    .catch( error => console.log(error))
  }

  const lastMessageRef = useRef(null);

// This useEffect will run whenever messages change
  useEffect(() => {
    // Scroll to the last message
    if (lastMessageRef.current) {
      // Scroll to the last message
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesArray]);

return (
    <div id="chat-box">
      {isLoading?
      <div className="getting-messages">
        <div className="circle-loading"></div>
      </div>
      :
      <>
          <div className="chat-header">
            <div style={{display:"flex"}}>
              <img src={chatInformation.picture} style={{marginRight:"10px", height:"30px", width:"30px", borderRadius:"50%"}}/>
              {typingEffect?
                <div className="typing-effect">
                  <div>Typing...</div>
                  <span className="mini-loading"></span>
                </div>
              :
                <div>{chatInformation.name}</div>
              }
            </div>
            <img onClick={handleCloseChat} src={closeButton} />
          </div>

          <div id="chat-messages" className="chat-messages">
            {messagesArray.map( (message, index) => {
              return  (
              <div key={index} >
                {message.newDay && 
                <div className="day-message">{renameDay(message.updatedAt)}</div>
                }
                <div ref={index === messagesArray.length - 1 ? lastMessageRef : null}
                     className={ message.sender === chatInformation.idOther? "message" :"message others" } >
                    <p>{message.content}</p>
                    <div className="time-message">{message.updatedAt.slice(11, 16)}</div>
                </div>
              </div>
              )
            })}
          </div>
          

          <form onSubmit={handleSendMessage} className="chat-write-space">
            <input type="text" id="write-message" placeholder="Type..." onChange={isTyping}/>
            {/* <button type="submit" id="send-message-button"> <img src={sendButton} /> </button> */}
          </form>
      </>
      }
    </div>
  )
}