import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import reportService from '../../../services/reportService';
import { CustomSelect } from '../CustomSelect';
import SuccessAnimation from '../feedback/SuccessAnimation';
import styles from './ReportModal.module.css';

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam or scam' },
    { value: 'fraud', label: 'Fraudulent listing' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'other', label: 'Other' },
];

const ReportModal = ({ show, onHide, productId }) => {
    const [reason, setReason] = useState('spam');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await reportService.createResult({
                product: productId,
                reason,
                details
            });

            // Show success animation instead of toast
            setShowSuccess(true);

            // Close modal after animation
            setTimeout(() => {
                setShowSuccess(false);
                setDetails('');
                setReason('spam');
                onHide();
            }, 2000);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || 'Failed to submit report';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onHide();
        }
    };

    return (
        <>
            {showSuccess && <SuccessAnimation message="Report Submitted Successfully!" />}

            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                <div className={styles.modalContent}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>Report Product</h3>
                        <button className={styles.closeButton} onClick={onHide}>
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formGroup}>
                        <div className={styles.formGroup}>
                            <CustomSelect
                                label="Reason"
                                options={REPORT_REASONS}
                                value={reason}
                                onChange={setReason}
                                placeholder="Select a reason..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Details (Optional)</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className={styles.textarea}
                                placeholder="Please provide additional details..."
                            />
                        </div>

                        <div className={styles.actions}>
                            <button type="button" onClick={onHide} className={styles.cancelButton}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.submitButton}
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReportModal;
