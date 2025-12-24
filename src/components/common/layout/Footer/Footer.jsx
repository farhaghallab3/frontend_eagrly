// Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaTwitter, FaLinkedin, FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import { MdSchool, MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { label: "Marketplace", path: "/marketplace" },
            { label: "Categories", path: "/categories" },
            { label: "My Ads", path: "/my-ads" },
            { label: "Dashboard", path: "/dashboard" }
        ],
        support: [
            { label: "Help Center", path: "/help" },
            { label: "Contact Us", path: "/contact" },
            { label: "FAQ", path: "/faq" },
            { label: "Report Issue", path: "/report" }
        ],
        company: [
            { label: "About Us", path: "/aboutus" },
            { label: "Careers", path: "/careers" },
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms of Service", path: "/terms" }
        ],
        connect: [
            { label: "Blog", path: "/blog" },
            { label: "Newsletter", path: "/newsletter" },
            { label: "Community", path: "/community" },
            { label: "Partners", path: "/partners" }
        ]
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <Container>
                    <Row>
                        <Col lg={4} md={6} className={styles.footerSection}>
                            <div className={styles.brandSection}>
                                <div className={styles.footerLogo}>
                                    <MdSchool size={32} className={styles.logoIcon} />
                                    <span className={styles.brandText}>Eagerly</span>
                                </div>
                                <p className={styles.brandDescription}>
                                    Your trusted marketplace for discovering amazing products and connecting with sellers worldwide.
                                </p>

                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <MdEmail className={styles.contactIcon} />
                                        <span>support@eagerly.com</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <MdPhone className={styles.contactIcon} />
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <MdLocationOn className={styles.contactIcon} />
                                        <span>San Francisco, CA</span>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={2} md={6} className={styles.footerSection}>
                            <h6 className={styles.sectionTitle}>Platform</h6>
                            <ul className={styles.footerLinks}>
                                {footerLinks.platform.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className={styles.footerLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Col>

                        <Col lg={2} md={6} className={styles.footerSection}>
                            <h6 className={styles.sectionTitle}>Support</h6>
                            <ul className={styles.footerLinks}>
                                {footerLinks.support.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className={styles.footerLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Col>

                        <Col lg={2} md={6} className={styles.footerSection}>
                            <h6 className={styles.sectionTitle}>Company</h6>
                            <ul className={styles.footerLinks}>
                                {footerLinks.company.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className={styles.footerLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Col>

                        <Col lg={2} md={6} className={styles.footerSection}>
                            <h6 className={styles.sectionTitle}>Connect</h6>
                            <ul className={styles.footerLinks}>
                                {footerLinks.connect.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className={styles.footerLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>

                    <div className={styles.footerBottom}>
                        <div className={styles.footerBottomContent}>
                            <div className={styles.socialSection}>
                                <h6 className={styles.socialTitle}>Follow Us</h6>
                                <div className={styles.socialLinks}>
                                    <a href="#" className={styles.socialLink} aria-label="Twitter">
                                        <FaTwitter />
                                    </a>
                                    <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                        <FaLinkedin />
                                    </a>
                                    <a href="#" className={styles.socialLink} aria-label="Facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" className={styles.socialLink} aria-label="Instagram">
                                        <FaInstagram />
                                    </a>
                                    <a href="#" className={styles.socialLink} aria-label="GitHub">
                                        <FaGithub />
                                    </a>
                                </div>
                            </div>

                            <div className={styles.copyright}>
                                <p>© {currentYear} Eagrely. All rights reserved.</p>
                                <p className={styles.madeWith}>
                                    Made with <span className={styles.heart}>❤️</span> for the community
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
