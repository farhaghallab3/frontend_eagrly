import React, { useEffect, useRef } from "react";
import styles from "./ChatMessages.module.css";
import { MdDoneAll } from "react-icons/md";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end"
      });
    }
  };

  useEffect(() => {
    // Small delay to allow messages to render
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const formatTime = (timeString) => {
    if (!timeString || timeString === "Just now") return "Just now";
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "Just now";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.messagesContainer} style={{ height: '100%' }}>
      <div className={styles.messagesList} ref={listRef}>
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
                      <img
                        src="https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"
                        alt="User"
                        className={styles.avatarImage}
                      />
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    {isReceived && showAvatar && (
                      <span className={styles.senderName}>{msg.sender}</span>
                    )}
                    <div className={`${styles.messageBubble} ${isSent ? styles.sentBubble : styles.receivedBubble}`}>
                      {msg.text && msg.text.startsWith('data:image/') ? (
                        <div className={styles.messageImage}>
                          <img
                            src={msg.text}
                            alt="Shared"
                            className={styles.sharedImage}
                            onClick={() => window.open(msg.text, '_blank')}
                          />
                        </div>
                      ) : (
                        <div className={styles.messageText}>{msg.text}</div>
                      )}

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
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} style={{ float: "left", clear: "both", height: '1px' }} />
      </div>

      {/* <button
        className={styles.scrollBottomBtn}
        onClick={() => scrollToBottom(true)}
        title="Scroll to bottom"
      >
        ↓
      </button> */}
    </div>
  );
};

export default ChatMessages;
