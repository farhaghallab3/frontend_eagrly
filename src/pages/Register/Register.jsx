import React from "react";
import { useForm } from "react-hook-form";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
import FormInput from "@components/common/forms/FormInput/FormInput";
import FormWrapper from "@components/common/forms/FormWrapper/FormWrapper";
import { useAuth } from "../../hooks/useAuth";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { FaCheck, FaTimes } from "react-icons/fa";
import styles from "./Register.module.css";

const Register = () => {
    const { register: authRegister, loading, error, loginWithGoogle, loginWithFacebook } = useAuth();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password") || "";

    // Password requirement checks
    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
        { label: "One number (0-9)", met: /[0-9]/.test(password) },
        { label: "One special character (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const onSubmit = (data) => {
        if (!allRequirementsMet) {
            return; // Don't submit if requirements not met
        }
        authRegister({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            university: data.university,
            faculty: data.faculty,
            password: data.password,
            rePassword: data.rePassword,
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
            title="Create Account"
            subtitle="Join our community of students and professionals"
            onSubmit={handleSubmit(onSubmit)}
            socialButtons={socialButtons}
            footerText="Already have an account? "
            footerLinkText="Sign In"
            footerLinkTo="/login"
        >
            {/* Error Messages */}
            <div className="errorContainer">
                {formatErrors()}
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                    Personal Information
                </h3>

                <FormInput
                    label="first name"
                    type="text"
                    placeholder="Enter your first name"
                    {...register("first_name", { required: "First name is required" })}
                    error={errors.first_name}
                />
                <FormInput
                    label="last name"
                    type="text"
                    placeholder="Enter your last name"
                    {...register("last_name", { required: "Last name is required" })}
                    error={errors.last_name}
                />
                <FormInput
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                    {...register("username", { required: "Username is required" })}
                    error={errors.username}
                />
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                    Contact Information
                </h3>

                <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email", { required: "Email is required" })}
                    error={errors.email}
                />

                <FormInput
                    label="Phone"
                    type="text"
                    placeholder="Enter your phone number"
                    {...register("phone", { required: "Phone number is required" })}
                    error={errors.phone}
                />
            </div>

            {/* Academic Information */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className={styles.sectionHeading}>
                    Academic Information
                </h3>

                <FormInput
                    label="University"
                    type="text"
                    placeholder="Enter your university name"
                    {...register("university", { required: "University is required" })}
                    error={errors.university}
                />
                <FormInput
                    label="Faculty"
                    type="text"
                    placeholder="Enter your faculty/department"
                    {...register("faculty", { required: "Faculty is required" })}
                    error={errors.faculty}
                />
            </div>

            {/* Security */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 className={styles.sectionHeading}>
                    Security
                </h3>

                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    {...register("password", {
                        required: "Password is required",
                        validate: () => allRequirementsMet || "Password does not meet all requirements",
                    })}
                    error={errors.password}
                />

                {/* Password Requirements Checklist */}
                <div className={styles.passwordRequirements}>
                    <p className={styles.requirementsTitle}>Password must contain:</p>
                    <ul className={styles.requirementsList}>
                        {passwordRequirements.map((req, index) => (
                            <li key={index} className={req.met ? styles.requirementMet : styles.requirementUnmet}>
                                {req.met ? <FaCheck className={styles.checkIcon} /> : <FaTimes className={styles.timesIcon} />}
                                <span>{req.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>


                <FormInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register("rePassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                    })}
                    error={errors.rePassword}
                />
            </div>

            <ButtonPrimary
                text={loading ? "Creating Account..." : "Create Account"}
                type="submit"
                variant="filled"
            />
        </FormWrapper>
    );
};

export default Register;
