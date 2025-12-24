import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../../../hooks/useAuth";
import { useSelector } from "react-redux";

const ChatList = ({ chats, onSelectChat }) => {
  const { user } = useAuth();
  const { selectedChatId } = useSelector((state) => state.chat);

  return (
    <div className="modern-chat-list">
      {chats.length === 0 ? (
        <div className="empty-chats">
          <div className="empty-chats-content">
            <div className="empty-icon">💬</div>
            <h6>No conversations yet</h6>
            <p>Start chatting with sellers to see your messages here</p>
          </div>
        </div>
      ) : (
        <ListGroup variant="flush" className="chat-list-group">
          {chats.map((chat) => {
            const otherUser = user?.id === chat.buyer.id ? chat.seller : chat.buyer;
            const isSelected = selectedChatId === chat.id;
            const hasUnread = chat.unreadCount > 0;

            return (
              <ListGroup.Item
                key={chat.id}
                action
                onClick={() => onSelectChat(chat.id)}
                className={`chat-list-item ${isSelected ? 'active' : ''} ${hasUnread ? 'unread' : ''}`}
              >
                <div className="chat-item-avatar">
                  <img
                    src={otherUser?.photoURL || "https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"}
                    alt={otherUser?.username}
                    className="avatar-image"
                  />
                  <div className="online-indicator"></div>
                </div>

                <div className="chat-item-content">
                  <div className="chat-item-header">
                    <div className="chat-user-name">
                      {otherUser?.username || "User"}
                    </div>
                    <div className="chat-timestamp">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="chat-item-body">
                    <div className="chat-product-title">
                      {chat.product?.title || "Product"}
                    </div>
                    {hasUnread && (
                      <Badge bg="danger" className="unread-badge">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      <style>{`
        .modern-chat-list {
          height: 100%;
          overflow-y: auto;
        }

        .empty-chats {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
        }

        .empty-chats-content {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          opacity: 0.5;
        }

        .chat-list-group {
          border: none;
        }

        .chat-list-item {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(100, 255, 218, 0.1);
          padding: 15px 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          color: rgba(255, 255, 255, 0.8);
        }

        .chat-list-item:hover {
          background: rgba(100, 255, 218, 0.1) !important;
          transform: translateX(5px);
          color: #64ffda !important;
        }

        .chat-list-item:hover .chat-user-name,
        .chat-list-item:hover .chat-product-title,
        .chat-list-item:hover .chat-timestamp {
          color: #64ffda !important;
        }

        .chat-list-item.active {
          background: rgba(100, 255, 218, 0.15);
          border-left: 3px solid #64ffda;
          transform: translateX(5px);
        }

        .chat-list-item.unread {
          background: rgba(239, 68, 68, 0.05);
        }

        .chat-list-item:last-child {
          border-bottom: none;
        }

        .chat-item-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(100, 255, 218, 0.3);
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid rgba(15, 26, 36, 0.95);
          border-radius: 50%;
        }

        .chat-item-content {
          flex: 1;
          min-width: 0;
        }

        .chat-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .chat-user-name {
          font-weight: 600;
          color: #ffffff;
          font-size: 1rem;
        }

        .chat-timestamp {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .chat-item-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-product-title {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          margin-right: 10px;
        }

        .unread-badge {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .chat-list-item {
            padding: 12px 15px;
          }

          .avatar-image {
            width: 45px;
            height: 45px;
          }

          .chat-user-name {
            font-size: 0.95rem;
          }

          .chat-product-title {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatList;
