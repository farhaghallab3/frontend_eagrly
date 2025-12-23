import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import ChatMessage from "./ChatMessage";

const ChatContainer = ({ messages }) => {
  return (
    <Card.Body
      style={{
        height: "400px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <ListGroup variant="flush">
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
      </ListGroup>
    </Card.Body>
  );
};

export default ChatContainer;
