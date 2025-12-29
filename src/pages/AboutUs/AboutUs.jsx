import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import {
    FaRocket,
    FaGlasses,
    FaFlag,
    FaUsers,
    FaGlobe,
    FaLightbulb,
    FaUserShield,
    FaHandshake,
    FaHeadset,
    FaStar,
    FaQuoteLeft,
    FaArrowRight,
} from "react-icons/fa";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
    return (
        <div className={styles.aboutPage}>


            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Our Story: Engineering the Future of Remote Work.</h1>
                    <h2>
                        We're a team of innovators and creators dedicated to building
                        seamless, powerful, and elegant hardware that empowers the modern
                        remote workforce.
                    </h2>
                    <Button className={styles.primaryBtn}>Explore Products</Button>
                </div>
            </section>

            {/* Mission & Vision */}
            <Container className={styles.section}>
                <h2>Our Mission and Vision</h2>
                <p>
                    We are driven by a core purpose and a forward-looking vision for the
                    future of remote work.
                </p>
                <Row >
                    <Col md={6}  >
                        <Card className={styles.card}>
                            <FaRocket className={styles.icon} />
                            <div>
                                <h3>Our Mission</h3>
                                <p>
                                    To empower professionals with innovative technology that makes
                                    remote work more productive, connected, and inspiring.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className={styles.card}>
                            <FaGlasses className={styles.icon} />
                            <div>
                                <h3>Our Vision</h3>
                                <p>
                                    A world where talent and opportunity are not limited by
                                    location, supported by tools that bridge the distance
                                    seamlessly.
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Timeline */}
            <Container className={styles.section}>
                <h2>Our Journey</h2>
                <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                        <FaFlag className={styles.icon} />
                        <div>
                            <p className={styles.timelineTitle}>Company Founded</p>
                            <p className={styles.timelineDate}>2018</p>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <FaRocket className={styles.icon} />
                        <div>
                            <p className={styles.timelineTitle}>First Product Launch</p>
                            <p className={styles.timelineDate}>2019</p>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <FaUsers className={styles.icon} />
                        <div>
                            <p className={styles.timelineTitle}>Expanded to 100 Employees</p>
                            <p className={styles.timelineDate}>2021</p>
                        </div>
                    </div>
                    <div className={styles.timelineItem}>
                        <FaGlobe className={styles.icon} />
                        <div>
                            <p className={styles.timelineTitle}>Opened International Office</p>
                            <p className={styles.timelineDate}>2023</p>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Team */}
            <Container className={styles.section}>
                <h2>Meet the Team</h2>
                <p>
                    The brilliant minds behind Eagerly, dedicated to pushing the boundaries
                    of remote work technology.
                </p>
                <div className={styles.teamGrid}>
                    {[
                        {
                            name: "Ahmed",
                            role: "Team Member",
                        },
                        {
                            name: "Farha",
                            role: "Team Member",
                        },
                        {
                            name: "Kamel",
                            role: "Team Member",
                        },
                        {
                            name: "Kareem",
                            role: "Team Member",
                        },
                    ].map((member, idx) => (
                        <div key={idx} className={styles.teamCard}>
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </Container>

            {/* Values */}
            <Container className={styles.section}>
                <h2>Our Values</h2>
                <p>The core principles that guide our culture, decisions, and innovation.</p>
                <Row>
                    <Col md={6}>
                        <Card className={styles.valueCard}>
                            <FaLightbulb className={styles.icon} />
                            <div>
                                <h3>Innovation</h3>
                                <p>
                                    We relentlessly pursue new ideas and technologies to solve the
                                    challenges of remote work.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className={styles.valueCard}>
                            <FaHeadset className={styles.icon} />
                            <div>
                                <h3>Customer-Centricity</h3>
                                <p>
                                    Our users are at the heart of everything we build. Their success
                                    is our success.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className={styles.valueCard}>
                            <FaUserShield className={styles.icon} />
                            <div>
                                <h3>Integrity</h3>
                                <p>
                                    We believe in transparency and honesty in our products, our
                                    processes, and our communication.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className={styles.valueCard}>
                            <FaHandshake className={styles.icon} />
                            <div>
                                <h3>Collaboration</h3>
                                <p>
                                    We champion teamwork and open communication, both within our
                                    company and with our community.
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutUs;
