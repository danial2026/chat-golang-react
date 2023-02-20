import React, { useEffect, useState } from "react";
import W3CWebSocket from 'websocket';
// import './chat.css'

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
    // backgroundColor: "#f4f4f4",
  },
};

function RoomPage() {
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [client, setClient] = useState(null);
  const [clientIsOpen, setClientIsOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("id");

    if (redirectParam) {
      setRoomId(redirectParam)
      const fetchData = async (accessToken, roomId) => {
        const newClient = new W3CWebSocket.w3cwebsocket('wss://chatws.danials.space/ws' + '?token=' + accessToken + '&room_id=' + roomId);

        newClient.onopen = () => {
          console.log('WebSocket Client Connected');
          setClientIsOpen(true);
        };
    
        newClient.onmessage = (message) => {
          const parsedMessage = JSON.parse(message.data);
          
          console.log(parsedMessage);
          if (parsedMessage.body) {
            const parsedMessageBody = JSON.parse(parsedMessage.body);
            console.log(parsedMessageBody.id);
            setMessages(prevMessages => [...prevMessages, parsedMessageBody]);
          }
        };
    
        newClient.onerror = (error) => {
          console.log('Connection Error:', error);
        };
    
        newClient.onclose = function(e) {
          console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
          setTimeout(function() {
            fetchData(accessToken, roomId);
          }, 100000);

          // setClientIsOpen(false);
          window.location.reload();
        };

        setClient(newClient);
      }
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        fetchData(accessToken, redirectParam);
      }
    } else {
      // Redirect to main page if user is not logged in
      window.location.href = "/";
    }

    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    
    if (clientIsOpen) {
      const message = {
          "room_id": `${roomId}`,
          "action": "sendMessage",
          "type": 'text',
          "text_content": `${messageText}`,
          "operation": "create",
      };
      
      client.send(JSON.stringify(message));
      setMessageText('');
    }
  };

  return (
    <div style={styles.container}>
      <div className="room-container">
        <div className="room-header">Room Title</div>
        <div className="room-message-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className='room-message-mutual'
            >
              {message.text_content}
            </div>
          ))}
        </div>
        <div className="room-input-container">
          <input
            className="room-input"
            type="text"
            placeholder="Type your message"
            value={messageText}
            onKeyPress={handleKeyPress}
            onChange={(event) => { setMessageText(event.target.value) }}
          />
          <button className="room-send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;