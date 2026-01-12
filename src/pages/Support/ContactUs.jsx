import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Aurora } from '@components/common/reactbits';
import SEO from "@components/common/SEO/SEO";
import styles from "./ContactUs.module.css";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/contact/', {  // Note: axiosInstance base URL usually includes /api
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    return (
        <div className={styles.contentWrapper}>
            <SEO 
                title="Contact Us" 
                description="Get in touch with the Stuplies team. We are here to help with any questions or support you need."
            />
            
            <div className={styles.backgroundContainer}>
                <Aurora
                    colorStops={['#FFB300', '#FF8F00', '#FFC107']}
                    amplitude={1.2}
                    blend={0.6}
                    speed={0.4}
                    className={styles.auroraBackground}
                />
                <div className={styles.gridPattern}></div>
            </div>

            <div className={styles.contactPage}>
                <Container>
                    <div className={styles.hero}>
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you. Our team is always here to help.</p>
                    </div>

                    <Row className="justify-content-center">
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <div className={styles.contactInfoCard}>
                                <h2 className={styles.sectionTitle}>Contact Info</h2>
                                <p style={{ color: '#8892b0' }}>
                                    Fill out the form and our team will get back to you within 24 hours.
                                </p>

                                <div className={styles.contactsList}>
                                    <div className={styles.contactItem}>
                                        <div className={styles.iconBox}><MdEmail /></div>
                                        <div className={styles.contactDetails}>
                                            <h4>Email</h4>
                                            <p>support@stuplies.com</p>
                                        </div>
                                    </div>

                                    <div className={styles.contactItem}>
                                        <div className={styles.iconBox}><MdPhone /></div>
                                        <div className={styles.contactDetails}>
                                            <h4>Phone</h4>
                                            <p>+20 123 456 7890</p>
                                        </div>
                                    </div>

                                    <div className={styles.contactItem}>
                                        <div className={styles.iconBox}><MdLocationOn /></div>
                                        <div className={styles.contactDetails}>
                                            <h4>Location</h4>
                                            <p>Cairo, Egypt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={7}>
                            <div className={styles.formCard}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.formLabel}>First Name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="firstName"
                                                    placeholder="John" 
                                                    className={styles.formInput} 
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.formLabel}>Last Name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="lastName"
                                                    placeholder="Doe" 
                                                    className={styles.formInput} 
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            name="email"
                                            placeholder="john@example.com" 
                                            className={styles.formInput} 
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.formLabel}>Subject</Form.Label>
                                        <Form.Control 
                                            as="select" 
                                            name="subject"
                                            className={styles.formInput}
                                            value={formData.subject}
                                            onChange={handleChange}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Billing Question</option>
                                            <option>Report an Issue</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.formLabel}>Message</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            name="message"
                                            rows={5} 
                                            placeholder="How can we help you?" 
                                            className={styles.formInput} 
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Button className={styles.submitBtn} type="submit">
                                        Send Message
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default ContactUs;
