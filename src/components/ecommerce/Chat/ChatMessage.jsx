import React, { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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

            // Check if this is a continuation from the same sender
            const prevMsg = messages[i - 1];
            const nextMsg = messages[i + 1];
            const isSameSenderAsPrev = prevMsg && prevMsg.type === msg.type;
            const isSameSenderAsNext = nextMsg && nextMsg.type === msg.type;

            // Only show avatar/name on first message in a group
            const showSenderInfo = !isSameSenderAsPrev;
            // Check if this is the last message in a group (for bubble styling)
            const isLastInGroup = !isSameSenderAsNext;
            const isFirstInGroup = !isSameSenderAsPrev;

            // Animation variants for each message
            const messageVariants = {
              hidden: {
                opacity: 0,
                x: isSent ? 20 : -20,
                y: 10
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: i * 0.03 // Stagger effect
                }
              }
            };

            return (
              <motion.div
                key={i}
                className={`${styles.messageWrapper} ${isSent ? styles.sent : styles.received} ${isSameSenderAsPrev ? styles.grouped : ''}`}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
              >
                <div className={styles.messageContainer}>
                  {isReceived && (
                    <div className={styles.messageAvatar} style={{ visibility: showSenderInfo ? 'visible' : 'hidden' }}>
                      <img
                        src="https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"
                        alt="User"
                        className={styles.avatarImage}
                      />
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    {isReceived && showSenderInfo && (
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
              </motion.div>
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
