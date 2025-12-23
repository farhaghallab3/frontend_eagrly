import React from "react";
import styles from "./FormWrapper.module.css";

const FormWrapper = ({
    title,
    subtitle = "",
    children,
    onSubmit,
    socialButtons = [],
    footerText = "",
    footerLink = "",
    footerLinkText = "",
    footerLinkTo = ""
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                <div className={styles.formHeader}>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && (
                        <p className={styles.formSubtitle}>{subtitle}</p>
                    )}
                </div>

                {/* Social Login Section */}
                {socialButtons.length > 0 && (
                    <div className={styles.socialSection}>
                        <div className={styles.socialButtons}>
                            {socialButtons.map((button, index) => (
                                <button
                                    key={index}
                                    className={styles.socialButton}
                                    onClick={button.onClick}
                                    type="button"
                                >
                                    {button.icon && <button.icon className={styles.socialIcon} />}
                                    {button.text}
                                </button>
                            ))}
                        </div>

                        <div className={styles.socialDivider}>
                            <div className={styles.dividerLine}></div>
                            <span className={styles.dividerText}>or continue with email</span>
                            <div className={styles.dividerLine}></div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className={styles.formFields}>
                    {children}
                </form>

                {/* Footer */}
                {(footerText || footerLink) && (
                    <div className={styles.formFooter}>
                        <p className={styles.footerText}>
                            {footerText}
                            {footerLink && footerLinkText && (
                                <a href={footerLinkTo} className={styles.footerLink}>
                                    {footerLinkText}
                                </a>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormWrapper;
