import { useContext, useEffect, useState } from "react";
import "../styles/Chat.css";
import { AuthContext } from "../context/auth.context";
import LoadingPage from "./LoadingPage";

export default function Chat() {
  const { userInformation} = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect ( () => {
      if (userInformation.length !== 0 ) {
        console.log("Entra al useEffect")
        const newArray = userInformation.conversations.map ( element => {
        const idConversation = element._id
        const participant = element.participants.filter ( person => person._id !== userInformation._id )
          return {
          idConversation,
          name: participant[0].name,
          picture: participant[0].picture,
          idOther: participant[0]._id
          }    
         })

       setConversations(newArray)
       setIsLoading(false)}
    } ,[userInformation])
    
    return (
    <>
      { isLoading ? 
      <LoadingPage/>
    
      :
      <div className="space">
      <div className="conversations-list">Conversations list
      {conversations.map( (element, index) => {
        return <div key={index}>{element.name}, {element.picture}, {element.idConversation} </div>
      })
      }
        
      </div>

      <div id="chat-box">
        <div className="message">Hi how are you doing?</div>
        <div className="message others">Hi how are you doing?</div>
      </div>
    </div>
    }

    </>

  )
} 