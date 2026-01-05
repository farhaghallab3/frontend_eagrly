import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useSelector } from "react-redux";
import styles from "./ChatList.module.css";

const ChatList = ({ chats, onSelectChat }) => {
  const { user } = useAuth();
  const { selectedChatId } = useSelector((state) => state.chat);

  return (
    <div className={styles.chatListContainer}>
      {chats.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💬</span>
          <h6>No conversations yet</h6>
          <p>Start chatting with sellers to see your messages here</p>
        </div>
      ) : (
        <div className={styles.chatList}>
          {chats.map((chat) => {
            const otherUser = user?.id === chat.buyer.id ? chat.seller : chat.buyer;
            const isSelected = selectedChatId === chat.id;
            const hasUnread = chat.unread_count > 0;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`${styles.chatItem} ${isSelected ? styles.active : ''}`}
              >
                {/* <img
                  src={otherUser?.photoURL || "https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"}
                  alt={otherUser?.username}
                  className={styles.avatar}
                /> */}

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
                      <span className={styles.unreadBadge}>
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;
