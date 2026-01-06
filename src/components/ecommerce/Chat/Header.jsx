import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { MdArrowBack, MdReportProblem } from "react-icons/md";
import ReportUserModal from "./ReportUserModal";
import styles from "./Header.module.css";

const Header = ({ chat }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);

  const otherUser = user?.id === chat?.buyer?.id ? chat?.seller : chat?.buyer;

  return (
    <>
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
              <div className={styles.userDetails}>
                <h6 className={styles.userName}>{otherUser?.username || "User"}</h6>
                <div className={styles.userStatus}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.statusText}>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Button */}
          {otherUser && (
            <button
              className={styles.reportButton}
              onClick={() => setShowReportModal(true)}
              title="Report User"
            >
              <MdReportProblem size={20} />
            </button>
          )}
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

      {/* Report Modal */}
      <ReportUserModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUser={otherUser}
      />
    </>
  );
};

export default Header;

