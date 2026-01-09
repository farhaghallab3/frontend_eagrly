import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import styles from "./ChatList.module.css";

const ChatList = ({ chats, onSelectChat }) => {
  const { user } = useAuth();
  const { selectedChatId } = useSelector((state) => state.chat);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const emptyVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className={styles.chatListContainer}>
      {chats.length === 0 ? (
        <motion.div
          className={styles.emptyState}
          initial="hidden"
          animate="visible"
          variants={emptyVariants}
        >
          <span className={styles.emptyIcon}>💬</span>
          <h6>No conversations yet</h6>
          <p>Start chatting with sellers to see your messages here</p>
        </motion.div>
      ) : (
        <motion.div
          className={styles.chatList}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {chats.map((chat) => {
            const otherUser = user?.id === chat.buyer.id ? chat.seller : chat.buyer;
            const isSelected = selectedChatId === chat.id;
            const hasUnread = chat.unread_count > 0;

            return (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`${styles.chatItem} ${isSelected ? styles.active : ''}`}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.content}>
                  <div className={styles.header}>
                    <span className={styles.userName}>
                      {otherUser?.username || "User"}
                    </span>
                    <span className={styles.timestamp}>
                      {new Date(chat.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className={styles.header}>
                    <span className={styles.productTitle}>
                      {chat.product?.title || "Product"}
                    </span>
                    {hasUnread && (
                      <motion.span
                        className={styles.unreadBadge}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {chat.unread_count}
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default ChatList;
