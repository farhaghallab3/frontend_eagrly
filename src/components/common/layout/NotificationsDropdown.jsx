import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { MdCheckCircle, MdError, MdInfo, MdMessage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../../../store/slices/notificationSlice";
import styles from "./Header/Header.module.css";

const NotificationsDropdown = ({ show, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state) => state.notifications);

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

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product_approved':
        return <MdCheckCircle className={styles.notificationIconSuccess} />;
      case 'product_rejected':
        return <MdError className={styles.notificationIconError} />;
      case 'new_message':
        return <MdMessage className={styles.notificationIconInfo} />;
      default:
        return <MdInfo className={styles.notificationIconInfo} />;
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

  return (
    <Dropdown show={show} onToggle={onToggle} align="end">
      <Dropdown.Menu className={styles.notificationsDropdown}>
        <div className={styles.dropdownHeader}>
          <h6 className={styles.dropdownTitle}>Notifications</h6>
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
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <MdInfo size={32} className={styles.emptyIcon} />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className={styles.notificationsList}>
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.is_read ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>
                      {notification.title}
                    </div>
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatTime(notification.created_at)}
                    </div>
                  </div>

                  {!notification.is_read && (
                    <div className={styles.unreadIndicator}></div>
                  )}
                </div>
              ))}

              {notifications.length > 10 && (
                <div className={styles.viewAllBtn}>
                  <button onClick={() => {/* Navigate to full notifications page */ }}>
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
