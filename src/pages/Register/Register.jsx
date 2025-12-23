import React from "react";
import { useForm } from "react-hook-form";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
import FormInput from "@components/common/forms/FormInput/FormInput";
import FormWrapper from "@components/common/forms/FormWrapper/FormWrapper";
import { useAuth } from "../../hooks/useAuth";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const Register = () => {
    const { register: authRegister, loading, error, loginWithGoogle, loginWithFacebook } = useAuth();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password");

    const onSubmit = (data) => {
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
                <h3 style={{
                    color: '#64ffda',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
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
                <h3 style={{
                    color: '#64ffda',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
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
                <h3 style={{
                    color: '#64ffda',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
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
                <h3 style={{
                    color: '#64ffda',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    Security
                </h3>

                <FormInput
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    error={errors.password}
                />

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
