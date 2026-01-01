import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaFacebookF, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { useAuthModal } from '../../../context/AuthModalContext';
import { useAuth } from '../../../hooks/useAuth';
import FormInput from '../forms/FormInput/FormInput';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import OTPVerificationModal from './OTPVerificationModal';
import styles from './AuthModal.module.css';

const AuthModal = () => {
    const { isOpen, closeAuthModal } = useAuthModal();
    const {
        login,
        registerWithOTP,
        verifyOTPCode,
        resendOTPCode,
        clearErrors,
        loading,
        error,
        otpLoading,
        otpError,
        loginWithGoogle,
        loginWithFacebook
    } = useAuth();

    const [activeTab, setActiveTab] = useState('login');
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');

    const loginForm = useForm();
    const registerForm = useForm();
    const password = registerForm.watch('password');

    // Reset forms when modal closes
    useEffect(() => {
        if (!isOpen) {
            loginForm.reset();
            registerForm.reset();
            setShowOTPModal(false);
            setPendingEmail('');
            clearErrors();
        }
    }, [isOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeAuthModal();
        }
    };

    const onLoginSubmit = async (data) => {
        const result = await login({
            email: data.email,
            password: data.password,
        });
        if (result) {
            closeAuthModal();
            loginForm.reset();
        }
    };

    const onRegisterSubmit = async (data) => {
        const result = await registerWithOTP({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            university: data.university,
            faculty: data.faculty,
            password: data.password,
        });
        if (result) {
            setPendingEmail(data.email);
            setShowOTPModal(true);
        }
    };

    const handleOTPVerify = async (email, otp) => {
        const result = await verifyOTPCode(email, otp);
        return result;
    };

    const handleOTPResend = async (email) => {
        const result = await resendOTPCode(email);
        return result;
    };

    const handleOTPClose = (success) => {
        setShowOTPModal(false);
        if (success) {
            // Switch to login tab after successful verification
            setActiveTab('login');
            registerForm.reset();
        }
    };

    const handleSocialLogin = async (loginFn) => {
        const result = await loginFn();
        if (result) {
            closeAuthModal();
        }
    };

    const formatErrors = () => {
        if (!error) return null;

        // Handle email not verified error
        if (typeof error === 'object' && error.email_not_verified) {
            return (
                <div className={styles.errorMessage}>
                    Email not verified. Please verify your email before logging in.
                </div>
            );
        }

        if (typeof error === 'object' && !Array.isArray(error)) {
            // Handle detail message
            if (error.detail) {
                return <div className={styles.errorMessage}>{error.detail}</div>;
            }

            return Object.entries(error).map(([field, messages]) => (
                <div key={field} className={styles.errorMessage}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                </div>
            ));
        }

        if (Array.isArray(error)) {
            return error.map((errMsg, index) => (
                <div key={index} className={styles.errorMessage}>{errMsg}</div>
            ));
        }

        if (typeof error === 'string') {
            return <div className={styles.errorMessage}>{error}</div>;
        }

        return null;
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                <div className={styles.modal}>
                    {/* Close Button */}
                    <button className={styles.closeButton} onClick={closeAuthModal}>
                        <FaTimes />
                    </button>

                    {/* Tab Switcher */}
                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            <FaUser />
                            Sign In
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            <FaUserPlus />
                            Register
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className={styles.modalContent}>
                        {/* Error Messages */}
                        <div className={styles.errorContainer}>
                            {formatErrors()}
                        </div>

                        {/* Social Login Buttons */}
                        <div className={styles.socialSection}>
                            <button
                                className={styles.socialButton}
                                onClick={() => handleSocialLogin(loginWithGoogle)}
                                type="button"
                            >
                                <FaGoogle className={styles.socialIcon} />
                                Continue with Google
                            </button>
                            <button
                                className={styles.socialButton}
                                onClick={() => handleSocialLogin(loginWithFacebook)}
                                type="button"
                            >
                                <FaFacebookF className={styles.socialIcon} />
                                Continue with Facebook
                            </button>
                        </div>

                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>or continue with email</span>
                            <span className={styles.dividerLine}></span>
                        </div>

                        {/* Login Form */}
                        {activeTab === 'login' && (
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className={styles.form}>
                                <FormInput
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...loginForm.register('email', { required: 'Email is required' })}
                                    error={loginForm.formState.errors.email}
                                />
                                <FormInput
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...loginForm.register('password', { required: 'Password is required' })}
                                    error={loginForm.formState.errors.password}
                                />
                                <div className={styles.forgotPassword}>
                                    <a href="#" className={styles.forgotPasswordLink}>Forgot Password?</a>
                                </div>
                                <ButtonPrimary
                                    text={loading ? 'Signing In...' : 'Sign In'}
                                    type="submit"
                                    variant="filled"
                                />
                                <p className={styles.switchText}>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        className={styles.switchLink}
                                        onClick={() => setActiveTab('register')}
                                    >
                                        Register
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* Register Form */}
                        {activeTab === 'register' && (
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className={styles.form}>
                                <div className={styles.formSection}>
                                    <h4 className={styles.sectionTitle}>Personal Information</h4>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            label="First Name"
                                            type="text"
                                            placeholder="First name"
                                            {...registerForm.register('first_name', { required: 'First name is required' })}
                                            error={registerForm.formState.errors.first_name}
                                        />
                                        <FormInput
                                            label="Last Name"
                                            type="text"
                                            placeholder="Last name"
                                            {...registerForm.register('last_name', { required: 'Last name is required' })}
                                            error={registerForm.formState.errors.last_name}
                                        />
                                    </div>
                                    <FormInput
                                        label="Username"
                                        type="text"
                                        placeholder="Choose a username"
                                        {...registerForm.register('username', { required: 'Username is required' })}
                                        error={registerForm.formState.errors.username}
                                    />
                                </div>

                                <div className={styles.formSection}>
                                    <h4 className={styles.sectionTitle}>Contact Information</h4>
                                    <FormInput
                                        label="Email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...registerForm.register('email', { required: 'Email is required' })}
                                        error={registerForm.formState.errors.email}
                                    />
                                    <FormInput
                                        label="Phone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        {...registerForm.register('phone', { required: 'Phone is required' })}
                                        error={registerForm.formState.errors.phone}
                                    />
                                </div>

                                <div className={styles.formSection}>
                                    <h4 className={styles.sectionTitle}>Academic Information</h4>
                                    <FormInput
                                        label="University"
                                        type="text"
                                        placeholder="Enter your university"
                                        {...registerForm.register('university', { required: 'University is required' })}
                                        error={registerForm.formState.errors.university}
                                    />
                                    <FormInput
                                        label="Faculty"
                                        type="text"
                                        placeholder="Enter your faculty"
                                        {...registerForm.register('faculty', { required: 'Faculty is required' })}
                                        error={registerForm.formState.errors.faculty}
                                    />
                                </div>

                                <div className={styles.formSection}>
                                    <h4 className={styles.sectionTitle}>Security</h4>
                                    <FormInput
                                        label="Password"
                                        type="password"
                                        placeholder="Create a password (min 8 characters)"
                                        {...registerForm.register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                        })}
                                        error={registerForm.formState.errors.password}
                                    />
                                    <FormInput
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="Confirm your password"
                                        {...registerForm.register('rePassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) => value === password || 'Passwords do not match'
                                        })}
                                        error={registerForm.formState.errors.rePassword}
                                    />
                                </div>

                                <ButtonPrimary
                                    text={loading ? 'Creating Account...' : 'Create Account'}
                                    type="submit"
                                    variant="filled"
                                />
                                <p className={styles.switchText}>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        className={styles.switchLink}
                                        onClick={() => setActiveTab('login')}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            <OTPVerificationModal
                isOpen={showOTPModal}
                email={pendingEmail}
                onClose={handleOTPClose}
                onVerify={handleOTPVerify}
                onResend={handleOTPResend}
                loading={otpLoading}
                error={otpError}
            />
        </>
    );
};

export default AuthModal;

