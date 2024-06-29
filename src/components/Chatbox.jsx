import { useEffect, useState, useRef } from "react";
import "../styles/Chatbox.css";
import axios from "axios";
import closeButton from "../assets/closebutton.png";
import sendButton from "../assets/send.png";
import { findNewDays, renameDay } from "./fixDays";

export default function Chatbox({ chatInformation, handleCloseChat, addConversationToList, setShowAlert, sortConversationsAgain, socket}) {
  const [isLoading, setIsLoading] = useState(true);
  const [messagesArray, setMessagesArray] = useState([]);
  const storedToken = localStorage.getItem("authToken");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const lastMessages = 5;
  const [isOtherOnline, setIsOtherOnline] = useState(false);

  useEffect(() => {
    console.log("From useEffect")
    socket.emit('join-chat', chatInformation.idConversation);
    
    const handleOtherJoined = () => {
      console.log("Partner joined. Chaning user to true");
      setIsOtherOnline(true);
    };

    const handleOtherLeft = () => {
      console.log("Partner left. Changing to false");
      setIsOtherOnline(false);
    };

    const handleNewMessage = () => {
      console.log("Got message");
      setFetchAgain(prev => !prev);
    };

    const handleUserTyping = () => {
      timerTyping();
    };

    // Event Listeners
    socket.on("other-joined", handleOtherJoined);
    socket.on("other-left", handleOtherLeft);
    socket.on('new message', handleNewMessage);
    socket.on('user typing', handleUserTyping);

    // Cleaning events and leaving-chat
    return () => {
      console.log("executing leave-chat and clean events");
      socket.emit('leave-chat', chatInformation.idConversation);
      socket.off("other-joined", handleOtherJoined);
      socket.off("other-left", handleOtherLeft);
      socket.off('new message', handleNewMessage);
      socket.off('user typing', handleUserTyping);
    };
  }, []);

  function timerTyping() {
    setTypingEffect(true)
    setTimeout( () => {
      setTypingEffect(false)
    } , 2000)

  }

  function isTyping() {
    socket.emit('user typing', chatInformation.idConversation)
  }

  function sendMessageToSocket (newMessage) {
    const destiny = chatInformation.idConversation        
    socket.emit('new message', {destiny, newMessage})
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
      response.data
      const conversationId = response.data._id
      updateUsers(conversationId)
    })
    .catch (error => {
      console.log(error)
    })
  }

  //Adds the newly created conversation to the corresponding users
  function updateUsers (conversationId) {
    const body = {
      userId: chatInformation.idMe,
      userId2: chatInformation.idOther,
      conversationId: conversationId
    }
    axios.put(`${import.meta.env.VITE_API_URL}/user/add-conversation`, body, 
    { headers: { Authorization: `Bearer ${storedToken}`} }
    )
    .then( response => {
      document.getElementById('write-message').value = '';
      chatInformation.idConversation = conversationId;
      setFetchAgain(!fetchAgain);     
      addConversationToList(chatInformation);
    } )
    .catch( error => {
      console.log(error)
    })
  }

  function sendMessage(newMessage) {
    axios.put(`${import.meta.env.VITE_API_URL}/conversation/createMessage/${chatInformation.idConversation}`, newMessage,
      { headers: { Authorization: `Bearer ${storedToken}`} }
      )
    .then( (response) => {
      document.getElementById('write-message').value = '';
      setFetchAgain(!fetchAgain);
      sortConversationsAgain( chatInformation.idConversation, new Date().toISOString() )
      console.log("Other online?", isOtherOnline)
      if (isOtherOnline) {
        console.log("sending to socket")
        sendMessageToSocket(newMessage);
      } else {
        console.log("sending notification")
        sendNotification(newMessage)}
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
            <button type="submit" id="send-message-button"> <img src={sendButton} /> </button>
          </form>
      </>
      }
    </div>
  )
}