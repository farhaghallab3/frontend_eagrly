import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChats, setSelectedChat } from '../../../store/slices/chatSlice';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header/Header.module.css';

const ChatDropdown = ({ show, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, loading, unreadCount } = useSelector((state) => state.chat);

  useEffect(() => {
    if (show && chats.length === 0) {
      dispatch(fetchChats());
    }
  }, [show, chats.length, dispatch]);

  const handleChatSelect = (chatId) => {
    dispatch(setSelectedChat(chatId));
    navigate(`/chat/${chatId}`);
    onToggle(false);
  };

  const handleViewAll = () => {
    navigate('/chat');
    onToggle(false);
  };

  if (!show) return null;

  return (
    <div className={styles.chatDropdown} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownTitle}>Messages</span>
        {unreadCount > 0 && (
          <span className={styles.chatUnreadBadge}>{unreadCount}</span>
        )}
      </div>

      <div className={styles.chatListContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : chats.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet</p>
          </div>
        ) : (
          <>
            <div className={styles.dropdownList}>
              {chats.slice(0, 5).map((chat) => {
                const otherUser = user?.id === chat.buyer.id ? chat.seller : chat.buyer;
                const hasUnread = chat.unread_count > 0;

                return (
                  <div
                    key={chat.id}
                    className={`${styles.chatItem} ${hasUnread ? styles.unreadChat : ''}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className={styles.chatItemContent}>
                      <div className={styles.chatUser}>
                        <span className={styles.chatUserName}>{otherUser.username}</span>
                        {hasUnread && (
                          <span className={styles.unreadIndicator}></span>
                        )}
                      </div>
                      <div className={styles.chatProduct}>
                        {chat.product.title}
                      </div>
                      <span className={styles.chatDate}>
                        {new Date(chat.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className={styles.viewAllButton}
              onClick={handleViewAll}
            >
              View all messages
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatDropdown;
