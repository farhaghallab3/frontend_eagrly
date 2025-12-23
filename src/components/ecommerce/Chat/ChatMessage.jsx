import React, { useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { MdDone, MdDoneAll } from "react-icons/md";
import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.emptyMessages}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIcon}>💬</div>
              <h5>Start a conversation</h5>
              <p>Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isSent = msg.type === "sent";
            const isReceived = msg.type === "received";
            const showAvatar = isReceived && (i === 0 || messages[i - 1].type !== "received");

            return (
              <div
                key={i}
                className={`${styles.messageWrapper} ${isSent ? styles.sent : styles.received}`}
              >
                <div className={styles.messageContainer}>
                  {isReceived && showAvatar && (
                    <div className={styles.messageAvatar}>
                      <Image
                        src="https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"
                        roundedCircle
                        width={36}
                        height={36}
                        className={styles.avatarImage}
                      />
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    <div className={`${styles.messageBubble} ${isSent ? styles.sentBubble : styles.receivedBubble}`}>
                      <div className={styles.messageText}>{msg.text}</div>

                      <div className={styles.messageFooter}>
                        <span className={styles.messageTime}>
                          {formatTime(msg.time)}
                        </span>
                        {isSent && (
                          <div className={styles.messageStatus}>
                            <MdDoneAll size={14} />
                          </div>
                        )}
                      </div>
                    </div>

                    {isReceived && showAvatar && (
                      <div className={styles.messageSpacer}></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
