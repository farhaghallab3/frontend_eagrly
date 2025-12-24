import React from "react";
import { Container, Accordion } from "react-bootstrap";
import styles from "./Support.module.css";

const FAQ = () => {
    const faqs = [
        {
            q: "What is Eagerly?",
            a: "Eagerly is a modern marketplace designed to connect buyers and sellers within university communities and beyond. We focus on providing a secure and seamless shopping experience."
        },
        {
            q: "How do I create an account?",
            a: "You can create an account by clicking the 'Register' button in the header. You'll need to provide your name, email, and create a password."
        },
        {
            q: "Is it free to list products?",
            a: "Yes, listing products on Eagerly is currently free for all users. We may introduce premium listing features in the future."
        },
        {
            q: "How do I contact a seller?",
            a: "On the product details page, click the 'Contact Seller' button. This will open a chat interface where you can message the seller directly."
        },
        {
            q: "What payment methods are accepted?",
            a: "We currently support various payment methods including credit/debit cards and local payment providers like Paymob."
        },
        {
            q: "How do I report a problem with a purchase?",
            a: "If you encounter any issues with a purchase, please contact our support team through the 'Contact Us' page or use the 'Report Issue' link in the footer."
        }
    ];

    return (
        <div className={styles.supportPage}>
            <section className={styles.hero}>
                <Container>
                    <div className={styles.heroContent}>
                        <h1>Frequently Asked Questions</h1>
                        <p>Find quick answers to your most common questions.</p>
                    </div>
                </Container>
            </section>

            <Container className={styles.section}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Accordion className={styles.faqAccordion}>
                        {faqs.map((faq, idx) => (
                            <Accordion.Item key={idx} eventKey={idx.toString()} className={styles.faqItem}>
                                <Accordion.Header className={styles.faqHeader}>{faq.q}</Accordion.Header>
                                <Accordion.Body className={styles.faqBody}>
                                    {faq.a}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </Container>
        </div>
    );
};

export default FAQ;
