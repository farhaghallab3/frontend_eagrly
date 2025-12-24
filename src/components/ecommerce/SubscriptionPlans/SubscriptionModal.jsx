import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import SubscriptionPlans from './SubscriptionPlans';
import styles from './SubscriptionModal.module.css';

const SubscriptionModal = ({ show, onClose }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <FaTimes size={24} />
                </button>
                <div className={styles.modalBody}>
                    <SubscriptionPlans isModal={true} />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SubscriptionModal;
