import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaCheck } from 'react-icons/fa';
import styles from './OTPVerificationModal.module.css';

const OTPVerificationModal = ({
    isOpen,
    email,
    onClose,
    onVerify,
    onResend,
    loading,
    error
}) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef([]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && inputRefs.current[0]) {
            setTimeout(() => inputRefs.current[0].focus(), 100);
        }
    }, [isOpen]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Reset OTP when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '']);
            setVerified(false);
            setResendCooldown(60); // Start with 60s cooldown on open
        }
    }, [isOpen]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pastedData.length === 4) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[3].focus();
        }
    };

    const handleSubmit = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 4) return;

        const result = await onVerify(email, otpValue);
        if (result?.success) {
            setVerified(true);
            // Auto close after success animation
            setTimeout(() => {
                onClose(true); // Pass true to indicate successful verification
            }, 2000);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        const result = await onResend(email);
        if (result?.success) {
            setOtp(['', '', '', '']);
            setResendCooldown(60);
            inputRefs.current[0].focus();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            onClose(false);
        }
    };

    if (!isOpen) return null;

    const isComplete = otp.every(digit => digit !== '');

    return (
        <div className={styles.otpOverlay} onClick={handleOverlayClick}>
            <div className={styles.otpModal}>
                <button
                    className={styles.closeButton}
                    onClick={() => onClose(false)}
                    disabled={loading}
                >
                    <FaTimes />
                </button>

                {verified ? (
                    // Success State
                    <div className={styles.successContainer}>
                        <div className={styles.successIcon}>
                            <FaCheck />
                        </div>
                        <h2 className={styles.successTitle}>Email Verified!</h2>
                        <p className={styles.successMessage}>
                            Your account has been successfully verified.
                        </p>
                    </div>
                ) : (
                    // OTP Input State
                    <>
                        <div className={styles.header}>
                            <div className={styles.iconWrapper}>
                                <FaEnvelope />
                            </div>
                            <h2 className={styles.title}>Verify Your Email</h2>
                            <p className={styles.subtitle}>
                                We've sent a 4-digit verification code to
                                <br />
                                <span className={styles.email}>{email}</span>
                            </p>
                        </div>

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.otpContainer} onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={styles.otpInput}
                                    placeholder="•"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <button
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={!isComplete || loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <div className={styles.resendSection}>
                            Didn't receive the code?{' '}
                            {resendCooldown > 0 ? (
                                <span className={styles.timer}>
                                    Resend in {resendCooldown}s
                                </span>
                            ) : (
                                <button
                                    className={styles.resendButton}
                                    onClick={handleResend}
                                    disabled={loading}
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OTPVerificationModal;
