import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./FormWrapper.module.css";

const FormWrapper = ({
    title,
    subtitle = "",
    children,
    onSubmit,
    socialButtons = [],
    footerText = "",
    footerLinkText = "",
    footerLinkTo = ""
}) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={styles.form}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className={styles.formHeader}
                    variants={headerVariants}
                >
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && (
                        <p className={styles.formSubtitle}>{subtitle}</p>
                    )}
                </motion.div>

                {/* Social Login Section */}
                {socialButtons.length > 0 && (
                    <motion.div
                        className={styles.socialSection}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className={styles.socialButtons}>
                            {socialButtons.map((button, index) => (
                                <motion.button
                                    key={index}
                                    className={styles.socialButton}
                                    onClick={button.onClick}
                                    type="button"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {button.icon && <button.icon className={styles.socialIcon} />}
                                    {button.text}
                                </motion.button>
                            ))}
                        </div>

                        <motion.div
                            className={styles.socialDivider}
                            variants={itemVariants}
                        >
                            <div className={styles.dividerLine}></div>
                            <span className={styles.dividerText}>or continue with email</span>
                            <div className={styles.dividerLine}></div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    onSubmit={onSubmit}
                    className={styles.formFields}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    {children}
                </motion.form>

                {/* Footer */}
                {(footerText || footerLinkText) && (
                    <motion.div
                        className={styles.formFooter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <p className={styles.footerText}>
                            {footerText}
                            {footerLinkTo && footerLinkText && (
                                <Link to={footerLinkTo} className={styles.footerLink}>
                                    {footerLinkText}
                                </Link>
                            )}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default FormWrapper;
