import React from "react";
import { useForm } from "react-hook-form";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
import FormInput from "@components/common/forms/FormInput/FormInput";
import FormWrapper from "@components/common/forms/FormWrapper/FormWrapper";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { login, loading, error, loginWithGoogle, loginWithFacebook } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        login({
            username: data.username,
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

        if (typeof error === "object" && !Array.isArray(error)) {
            return Object.entries(error).map(([field, messages]) => (
                <div key={field} className="errorMessage">
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(", ") : messages}
                </div>
            ));
        }

        if (Array.isArray(error)) {
            return error.map((errMsg, index) => (
                <div key={index} className="errorMessage">{errMsg}</div>
            ));
        }

        if (typeof error === "string") {
            return <div className="errorMessage">{error}</div>;
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
            <div className="errorContainer">
                {formatErrors()}
            </div>

            {/* Login Form */}
            <div style={{ marginBottom: '2rem' }}>
                <FormInput
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username", { required: "Username is required" })}
                    error={errors.username}
                />

                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    error={errors.password}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                    marginBottom: '0.5rem'
                }}>
                    <a
                        href="#"
                        style={{
                            color: '#64ffda',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#00c2ff'}
                        onMouseLeave={(e) => e.target.style.color = '#64ffda'}
                    >
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
