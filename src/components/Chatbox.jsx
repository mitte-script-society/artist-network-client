import "../styles/Chatbox.css" 

export default function Chatbox({ showingChatInfo, handleCloseChat}) {
  

  return ( 
    <div id="chat-box">

          <div className="chat-header">
            <div>Name</div>
            <button onClick={handleCloseChat}>Close </button>
          </div>

          <div className="chat-messages">
            <div className="message">Hi how are you doing?</div>
            <div className="message others">Hi how are you doing?</div>
          </div>

          <div className="chat-write-space">
            <textarea id="write-message" placeholder="Type..."></textarea>
            <button id="send-message-button"> {`>>`} </button>
          </div>
    </div>
  )
}