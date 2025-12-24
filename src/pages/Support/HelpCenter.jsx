import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { MdSearch, MdHelp, MdMessage, MdLibraryBooks, MdSecurity, MdPayment, MdLocalShipping } from "react-icons/md";
import styles from "./Support.module.css";

const HelpCenter = () => {
    const categories = [
        { icon: <MdLibraryBooks />, title: "Getting Started", desc: "Learn the basics of using Eagerly." },
        { icon: <MdSecurity />, title: "Account & Security", desc: "Manage your profile and keep your account safe." },
        { icon: <MdPayment />, title: "Payments & Billing", desc: "Understand how payments and payouts work." },
        { icon: <MdLocalShipping />, title: "Buying & Selling", desc: "Tips for successful transactions on our platform." },
        { icon: <MdHelp />, title: "FAQs", desc: "Quick answers to common questions." },
        { icon: <MdMessage />, title: "Contact Support", desc: "Need more help? Reach out to our team." }
    ];

    return (
        <div className={styles.supportPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <Container>
                    <div className={styles.heroContent}>
                        <h1>How can we help you today?</h1>
                        <div className={styles.searchBar}>
                            <MdSearch className={styles.searchIcon} />
                            <input type="text" placeholder="Search for articles, guides, and more..." />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Categories Grid */}
            <Container className={styles.section}>
                <Row>
                    {categories.map((cat, idx) => (
                        <Col key={idx} lg={4} md={6} className="mb-4">
                            <Card className={styles.categoryCard}>
                                <div className={styles.cardIcon}>{cat.icon}</div>
                                <h3>{cat.title}</h3>
                                <p>{cat.desc}</p>
                                <Button variant="link" className={styles.learnMore}>
                                    Learn More →
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Popular Articles */}
            <section className={styles.popularArticles}>
                <Container>
                    <h2 className={styles.sectionTitle}>Popular Articles</h2>
                    <Row>
                        <Col md={6}>
                            <ul className={styles.articleList}>
                                <li><a href="#">How to create a seller account?</a></li>
                                <li><a href="#">Is my payment secure?</a></li>
                                <li><a href="#">How to contact a seller?</a></li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <ul className={styles.articleList}>
                                <li><a href="#">What are the platform fees?</a></li>
                                <li><a href="#">How to report a fraudulent listing?</a></li>
                                <li><a href="#">Refund and return policy</a></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Still Need Help? */}
            <Container className={styles.section}>
                <div className={styles.contactBanner}>
                    <h2>Still need help?</h2>
                    <p>Our support team is available 24/7 to assist you with any issues.</p>
                    <div className={styles.bannerActions}>
                        <Button className={styles.primaryBtn}>Contact Us</Button>
                        <Button variant="outline-light" className={styles.secondaryBtn}>Live Chat</Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HelpCenter;
