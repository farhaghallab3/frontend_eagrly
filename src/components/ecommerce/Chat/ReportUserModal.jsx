import React, { useState } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import api from "../../../services/api";
import { CustomSelect } from "../../common/CustomSelect";
import SuccessAnimation from "../../common/feedback/SuccessAnimation";
import styles from "./ReportUserModal.module.css";

const REPORT_REASONS = [
    { value: "spam", label: "Spam or unwanted messages" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "scam", label: "Scam or fraud attempt" },
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "fake_profile", label: "Fake profile" },
    { value: "other", label: "Other" },
];

const ReportUserModal = ({ isOpen, onClose, reportedUser, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            setError("Please select a reason");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const reportData = {
                reported_user: reportedUser?.id,
                reason: `${REPORT_REASONS.find(r => r.value === reason)?.label}: ${details}`.trim(),
            };

            await api.post("/reports/", reportData);

            // Show success animation
            setShowSuccess(true);

            // Close modal after animation
            setTimeout(() => {
                setShowSuccess(false);
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
                setReason("");
                setDetails("");
            }, 2000);
        } catch (err) {
            console.error("Failed to submit report:", err);
            setError(err.response?.data?.detail || "Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {showSuccess && <SuccessAnimation message="Report Submitted Successfully!" />}

            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            <MdWarning className={styles.warningIcon} />
                            <h2>Report User</h2>
                        </div>
                        <button className={styles.closeButton} onClick={onClose}>
                            <MdClose size={24} />
                        </button>
                    </div>

                    <div className={styles.content}>
                        <p className={styles.description}>
                            Report <strong>{reportedUser?.username || "this user"}</strong> for violating our community guidelines.
                        </p>

                        {error && <div className={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <CustomSelect
                                    label="Reason for report"
                                    options={REPORT_REASONS}
                                    value={reason}
                                    onChange={setReason}
                                    placeholder="Select a reason..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Additional details (optional)</label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Provide any additional context..."
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !reason}
                                    className={styles.submitButton}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportUserModal;
