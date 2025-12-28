import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { FaTimes, FaClock, FaCrown } from 'react-icons/fa';
import SubscriptionPlans from './SubscriptionPlans';
import styles from './SubscriptionRequiredModal.module.css';

const SubscriptionRequiredModal = ({ show, onClose, daysUntilReset = 30 }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes size={24} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <FaClock className={styles.clockIcon} />
                    </div>
                    <h2 className={styles.title}>Free Ad Limit Reached</h2>
                    <p className={styles.message}>
                        You have used your 2 free ads for this period.
                    </p>
                    <div className={styles.countdown}>
                        <span className={styles.days}>{daysUntilReset}</span>
                        <span className={styles.daysLabel}>days until your free ads reset</span>
                    </div>
                </div>

                <div className={styles.divider}>
                    <span className={styles.orText}>or</span>
                </div>

                <div className={styles.upgradeSection}>
                    <div className={styles.crownIcon}>
                        <FaCrown />
                    </div>
                    <h3 className={styles.upgradeTitle}>Upgrade to Premium</h3>
                    <p className={styles.upgradeMessage}>
                        Subscribe to one of our plans below and start posting ads immediately!
                    </p>
                </div>

                <div className={styles.modalBody}>
                    <SubscriptionPlans isModal={true} onClose={onClose} />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SubscriptionRequiredModal;
