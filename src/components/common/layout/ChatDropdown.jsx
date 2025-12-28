import React, { useEffect } from 'react';
import { Dropdown, ListGroup, Spinner } from 'react-bootstrap';
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

  return (
    <Dropdown show={show} onToggle={onToggle} align="end">
      <Dropdown.Menu className={styles.chatDropdown}>
        <Dropdown.Header className={styles.dropdownHeader}>
          <span>Messages</span>
          {unreadCount > 0 && (
            <span className={styles.unreadIndicator}>{unreadCount}</span>
          )}
        </Dropdown.Header>

        <div className={styles.chatListContainer}>
          {loading ? (
            <div className="d-flex justify-content-center p-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center p-3 text-muted">
              No messages yet
            </div>
          ) : (
            <>
              {chats.slice(0, 5).map((chat) => {
                const otherUser = user?.id === chat.buyer.id ? chat.seller : chat.buyer;
                const hasUnread = chat.unread_count > 0;

                return (
                  <Dropdown.Item
                    key={chat.id}
                    className={`${styles.chatItem} ${hasUnread ? styles.unreadChat : ''}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className={styles.chatItemContent}>
                      <div className={styles.chatUser}>
                        <strong>{otherUser.username}</strong>
                        {hasUnread && (
                          <span className={styles.chatUnreadBadge}>
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                      <div className={styles.chatProduct}>
                        {chat.product.title}
                      </div>
                      <small className={styles.chatDate}>
                        {new Date(chat.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </Dropdown.Item>
                );
              })}

              {chats.length > 5 && (
                <Dropdown.Item
                  className={styles.viewAllButton}
                  onClick={handleViewAll}
                >
                  View all messages
                </Dropdown.Item>
              )}
            </>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChatDropdown;
