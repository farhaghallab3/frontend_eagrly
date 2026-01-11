import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { FaTimes, FaClock, FaCrown, FaStar } from 'react-icons/fa';
import SubscriptionPlans from './SubscriptionPlans';
import styles from './SubscriptionRequiredModal.module.css';

const SubscriptionRequiredModal = ({
    show,
    onClose,
    daysUntilReset = 30,
    mode = 'adLimit' // 'adLimit' | 'featured'
}) => {
    if (!show) return null;

    const isFeaturedMode = mode === 'featured';

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes size={24} />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        {isFeaturedMode ? (
                            <FaStar className={styles.clockIcon} style={{ color: '#fbbf24' }} />
                        ) : (
                            <FaClock className={styles.clockIcon} />
                        )}
                    </div>
                    <h2 className={styles.title}>
                        {isFeaturedMode ? 'Premium Feature' : 'Free Ad Limit Reached'}
                    </h2>
                    <p className={styles.message}>
                        {isFeaturedMode
                            ? 'Featured Ads are exclusive to our Plus, Premium, and VIP subscribers. Get your ads to the top of the marketplace!'
                            : 'You have used your 2 free ads for this period.'
                        }
                    </p>
                    {!isFeaturedMode && (
                        <div className={styles.countdown}>
                            <span className={styles.days}>{daysUntilReset}</span>
                            <span className={styles.daysLabel}>days until your free ads reset</span>
                        </div>
                    )}
                </div>

                <div className={styles.divider}>
                    <span className={styles.orText}>
                        {isFeaturedMode ? 'Subscribe to unlock' : 'or'}
                    </span>
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
