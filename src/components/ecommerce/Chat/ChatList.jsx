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
            const hasUnread = chat.unread_count > 0;

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
                        {chat.unread_count}
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
          overflow-x: hidden;
        }
        
        .modern-chat-list .chat-list-group {
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .empty-chats {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
        }

        /* Stronger selector to override Bootstrap */
        .modern-chat-list .list-group-item {
          background-color: transparent !important; /* Fixes white background issue */
          border: none;
          border-bottom: 1px solid var(--border-color);
          padding: 15px 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--text-secondary);
        }

        .modern-chat-list .list-group-item:hover {
          background-color: rgba(100, 255, 218, 0.1) !important;
          transform: translateX(5px);
          color: var(--accent-primary) !important;
        }

        .modern-chat-list .list-group-item:hover .chat-user-name,
        .modern-chat-list .list-group-item:hover .chat-product-title,
        .modern-chat-list .list-group-item:hover .chat-timestamp {
          color: var(--accent-primary) !important;
        }

        .modern-chat-list .list-group-item.active {
          background-color: rgba(100, 255, 218, 0.15) !important;
          border-left: 3px solid var(--accent-primary);
          transform: translateX(5px);
          color: var(--text-primary) !important;
          z-index: 1;
        }

        .modern-chat-list .list-group-item.unread {
          background-color: rgba(239, 68, 68, 0.05) !important;
        }

        .modern-chat-list .list-group-item:last-child {
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
          border: 2px solid var(--border-color);
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid var(--bg-card);
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
          color: var(--text-primary);
          font-size: 1rem;
        }

        .chat-timestamp {
          font-size: 0.75rem;
          color: var(--text-secondary);
          opacity: 0.7;
        }

        .chat-item-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-product-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
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

        /* Empty state text color */
        .empty-chats-content {
           text-align: center;
           color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .modern-chat-list .list-group-item {
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
