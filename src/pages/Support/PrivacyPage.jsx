import React from "react";
import { Container } from "react-bootstrap";
import styles from "./Support.module.css";

const PrivacyPage = () => {
    return (
        <div className={styles.supportPage}>
            <section className={styles.hero}>
                <Container>
                    <div className={styles.heroContent}>
                        <h1>Privacy Policy</h1>
                        <p>Last updated: December 24, 2025</p>
                    </div>
                </Container>
            </section>

            <Container className={styles.section}>
                <div className={styles.legalContent}>
                    <p>At Eagerly, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, list a product, or communicate with other users.</p>
                    <ul>
                        <li>Account information (name, email, password)</li>
                        <li>Profile information (avatar, bio, location)</li>
                        <li>Transaction information (payment details, purchase history)</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you about your account and transactions.</p>

                    <h2>3. Data Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and encrypted where appropriate.</p>

                    <h2>4. Cookies</h2>
                    <p>We use cookies to enhance your experience on our platform. You can choose to disable cookies in your browser settings, but some features may not function correctly.</p>

                    <h2>5. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

                    <h2>6. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@eagerly.com.</p>
                </div>
            </Container>
        </div>
    );
};

export default PrivacyPage;
