import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCheckCircle, MdError, MdInfo, MdMessage, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../../../store/slices/notificationSlice";
import styles from "./Header/Header.module.css";

const NotificationsDropdown = ({ show, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const [hiddenNotifications, setHiddenNotifications] = React.useState([]);

  useEffect(() => {
    if (show) {
      dispatch(fetchNotifications());
    }
  }, [show, dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      dispatch(markNotificationRead(notification.id));
    }
    if (notification.product) {
      const productId = typeof notification.product === 'object' ? notification.product.id : notification.product;
      navigate(`/product/${productId}`);
      onToggle(false);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    dispatch(markAllNotificationsRead());
  };

  const handleDismiss = (e, notificationId) => {
    e.stopPropagation();
    dispatch(markNotificationRead(notificationId));
    setHiddenNotifications(prev => [...prev, notificationId]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product_approved':
        return <MdCheckCircle className={styles.iconSuccess} />;
      case 'product_rejected':
        return <MdError className={styles.iconError} />;
      case 'new_message':
        return <MdMessage className={styles.iconInfo} />;
      default:
        return <MdInfo className={styles.iconInfo} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!show) return null;

  return (
    <div className={styles.notificationsDropdown} onClick={(e) => e.stopPropagation()}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownTitle}>Notifications</span>
        {notifications.length > 0 && (
          <button
            className={styles.markAllReadBtn}
            onClick={handleMarkAllRead}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className={styles.dropdownContent}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            <div className={styles.dropdownList}>
              {notifications
                .filter(n => !hiddenNotifications.includes(n.id))
                .slice(0, 10)
                .map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.is_read ? styles.unreadItem : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.itemIcon}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>
                      {notification.title}
                    </div>
                    <div className={styles.itemMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.itemTime}>
                      {formatTime(notification.created_at)}
                    </div>
                  </div>

                  {!notification.is_read && (
                    <div className={styles.unreadDot}></div>
                  )}

                  <button 
                    className={styles.closeBtn}
                    onClick={(e) => handleDismiss(e, notification.id)}
                    aria-label="Dismiss notification"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ))}
            </div>

            {notifications.length > 10 && (
              <button className={styles.viewAllButton}>
                View all notifications
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
