import React from "react";
import { Container } from "react-bootstrap";
import styles from "./Support.module.css";

const TermsOfService = () => {
    return (
        <div className={styles.supportPage}>
            <section className={styles.hero}>
                <Container>
                    <div className={styles.heroContent}>
                        <h1>Terms of Service</h1>
                        <p>Last updated: December 24, 2025</p>
                    </div>
                </Container>
            </section>

            <Container className={styles.section}>
                <div className={styles.legalContent}>
                    <p>Welcome to Eagerly. By using our platform, you agree to comply with and be bound by the following terms and conditions.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using Eagrely, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

                    <h2>2. User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                    <h2>3. Listing Guidelines</h2>
                    <p>Users are responsible for the accuracy of their listings. Prohibited items include illegal goods, weapons, and offensive material.</p>

                    <h2>4. Transactions</h2>
                    <p>Eagrely provides a platform for buyers and sellers to connect. We are not a party to the transactions and are not responsible for the quality or legality of the items sold.</p>

                    <h2>5. Intellectual Property</h2>
                    <p>All content on Eagrely, including text, graphics, and logos, is the property of Eagrely and is protected by intellectual property laws.</p>

                    <h2>6. Limitation of Liability</h2>
                    <p>Eagrely shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>

                    <h2>7. Governing Law</h2>
                    <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Eagrely operates.</p>
                </div>
            </Container>
        </div>
    );
};

export default TermsOfService;
