import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MdArrowBack } from "react-icons/md";
import styles from "./Header.module.css";

const Header = ({ chat }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const otherUser = user?.id === chat?.buyer?.id ? chat?.seller : chat?.buyer;

  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <MdArrowBack size={24} />
          </button>

          <div className={styles.userInfo}>
            {/* <div className={styles.userAvatar}>
              <img
                src={otherUser?.photoURL || "https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"}
                alt={otherUser?.username}
                className={styles.avatarImage}
              />
              <div className={styles.onlineStatus}></div>
            </div> */}

            <div className={styles.userDetails}>
              <h6 className={styles.userName}>{otherUser?.username || "User"}</h6>
              <div className={styles.userStatus}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chat?.product && (
        <div className={styles.productInfoBar}>
          <div className={styles.productInfo}>
            <span className={styles.productLabel}>Product:</span>
            <span className={styles.productTitle}>{chat.product.title}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
