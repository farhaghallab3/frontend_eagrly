
import React from 'react';
import styles from './SuccessAnimation.module.css';
import { MdCheck } from 'react-icons/md';

import { createPortal } from 'react-dom';

const SuccessAnimation = ({ message = "Success!" }) => {
    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.circle}>
                    <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                        <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
                <h3 className={styles.title}>{message}</h3>
            </div>
        </div>,
        document.body
    );
};

export default SuccessAnimation;
