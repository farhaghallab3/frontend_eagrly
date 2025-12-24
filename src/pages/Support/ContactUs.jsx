import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import styles from "./Support.module.css";

const ContactUs = () => {
    return (
        <div className={styles.supportPage}>
            <section className={styles.hero}>
                <Container>
                    <div className={styles.heroContent}>
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you. Our team is always here to help.</p>
                    </div>
                </Container>
            </section>

            <Container className={styles.section}>
                <Row>
                    <Col lg={5} className="mb-5 mb-lg-0">
                        <div className={styles.contactInfo}>
                            <h2 className={styles.sectionTitle}>Contact Information</h2>
                            <p className="mb-5">Fill out the form and our team will get back to you within 24 hours.</p>

                            <div className={styles.contactItem}>
                                <div className={styles.cardIcon}><MdEmail /></div>
                                <div>
                                    <h4>Email</h4>
                                    <p>support@eagrely.com</p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.cardIcon}><MdPhone /></div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.cardIcon}><MdLocationOn /></div>
                                <div>
                                    <h4>Location</h4>
                                    <p>San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col lg={7}>
                        <div className={styles.contactForm}>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className={styles.formGroup}>
                                            <Form.Label className={styles.formLabel}>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="John" className={styles.formInput} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className={styles.formGroup}>
                                            <Form.Label className={styles.formLabel}>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Doe" className={styles.formInput} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className={styles.formGroup}>
                                    <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                                    <Form.Control type="email" placeholder="john@example.com" className={styles.formInput} />
                                </Form.Group>

                                <Form.Group className={styles.formGroup}>
                                    <Form.Label className={styles.formLabel}>Subject</Form.Label>
                                    <Form.Control as="select" className={styles.formInput}>
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Billing Question</option>
                                        <option>Report an Issue</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className={styles.formGroup}>
                                    <Form.Label className={styles.formLabel}>Message</Form.Label>
                                    <Form.Control as="textarea" rows={5} placeholder="How can we help you?" className={styles.formInput} />
                                </Form.Group>

                                <Button className={styles.primaryBtn} type="submit" style={{ width: '100%' }}>
                                    Send Message
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ContactUs;
