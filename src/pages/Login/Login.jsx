import React from "react";
import { useForm } from "react-hook-form";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
import FormInput from "@components/common/forms/FormInput/FormInput";
import FormWrapper from "@components/common/forms/FormWrapper/FormWrapper";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

import styles from "./Login.module.css";

const Login = () => {
    const { login, loading, error, loginWithGoogle, loginWithFacebook } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        login({
            email: data.email,
            password: data.password,
        });
    };

    // Social login buttons configuration
    const socialButtons = [
        {
            icon: FaGoogle,
            text: "Continue with Google",
            onClick: loginWithGoogle
        },
        {
            icon: FaFacebookF,
            text: "Continue with Facebook",
            onClick: loginWithFacebook
        }
    ];

    // Format error messages
    const formatErrors = () => {
        if (!error) return null;

        // Handle specific "User already exists" scenario for Social Auth failures
        const errorStr = JSON.stringify(error).toLowerCase();
        if (errorStr.includes("already exists") || errorStr.includes("username already exists")) {
            return (
                <div className={styles.errorMessage}>
                    An account with this email/username already exists. Please log in with your email and password.
                </div>
            );
        }

        if (typeof error === "object" && !Array.isArray(error)) {
            return Object.entries(error).map(([field, messages]) => {
                const msgContent = Array.isArray(messages) ? messages.join(", ") : messages;
                // Don't show "non_field_errors:" prefix for general errors
                // For field errors (like email), capitalizing the field name looks better
                const isNonField = field === 'non_field_errors' || field === 'detail';

                return (
                    <div key={field} className={styles.errorMessage}>
                        {isNonField ? msgContent : (
                            <>
                                <strong style={{ textTransform: 'capitalize' }}>{field.replace('_', ' ')}:</strong> {msgContent}
                            </>
                        )}
                    </div>
                );
            });
        }

        if (Array.isArray(error)) {
            return error.map((errMsg, index) => (
                <div key={index} className={styles.errorMessage}>{errMsg}</div>
            ));
        }

        if (typeof error === "string") {
            return <div className={styles.errorMessage}>{error}</div>;
        }

        return null;
    };

    return (
        <FormWrapper
            title="Welcome Back"
            subtitle="Sign in to your account"
            onSubmit={handleSubmit(onSubmit)}
            socialButtons={socialButtons}
            footerText="Don't have an account? "
            footerLinkText="Create Account"
            footerLinkTo="/register"
        >
            {/* Error Messages */}
            <div className={styles.errorContainer}>
                {formatErrors()}
            </div>

            {/* Login Form */}
            <div style={{ marginBottom: '2rem' }}>
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                    error={errors.email}
                />

                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    error={errors.password}
                />

                <div className={styles.forgotPassword}>
                    <a href="#" className={styles.forgotPasswordLink}>
                        Forgot Password?
                    </a>
                </div>
            </div>

            <ButtonPrimary
                text={loading ? "Signing In..." : "Sign In"}
                type="submit"
                variant="filled"
            />
        </FormWrapper>
    );
};

export default Login;
