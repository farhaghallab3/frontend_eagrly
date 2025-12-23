import React from "react";
import { Button, Image, Dropdown } from "react-bootstrap";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdMoreVert, MdPhone, MdVideocam, MdInfo } from "react-icons/md";
import styles from "./Header.module.css";

const Header = ({ chat }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const otherUser = user?.id === chat?.buyer?.id ? chat?.seller : chat?.buyer;

  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <Button
            variant="link"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <MdArrowBack size={24} />
          </Button>

          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <Image
                src={otherUser?.photoURL || "https://i.pinimg.com/1200x/88/68/d7/8868d7b09e6eff73db538eee5e077816.jpg"}
                roundedCircle
                width={48}
                height={48}
                className={styles.avatarImage}
              />
              <div className={styles.onlineStatus}></div>
            </div>

            <div className={styles.userDetails}>
              <h6 className={styles.userName}>{otherUser?.username || "User"}</h6>
              <div className={styles.userStatus}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <Button variant="link" className={styles.headerActionBtn}>
            <MdPhone size={20} />
          </Button>

          <Button variant="link" className={styles.headerActionBtn}>
            <MdVideocam size={20} />
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className={styles.headerActionBtn}>
              <MdMoreVert size={20} />
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.headerDropdown}>
              <Dropdown.Item className={styles.dropdownItem}>
                <MdInfo size={18} />
                View Profile
              </Dropdown.Item>
              <Dropdown.Item className={styles.dropdownItem}>
                <MdInfo size={18} />
                Product Details
              </Dropdown.Item>
              <Dropdown.Divider className={styles.dropdownDivider} />
              <Dropdown.Item className={`${styles.dropdownItem} ${styles.danger}`}>
                Report User
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
