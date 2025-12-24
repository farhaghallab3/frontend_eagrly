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
                            name: "Alex Johnson",
                            role: "Founder & CEO",
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUEMKiytN31g7mLuRxWIR40BaDFCOfwWRvt46vPxIo4Vdcn_G9tGVWHBaKGGDw00S3uRKPSrkrkNJ4TOmGjFf5inmVDG8tXNlwt6ly5Djq7eVxoEw6kjgk7h0levXaMOfFpZQl6lT6vDfV-AUoC7tTxW9eQgNTgiDDqwvgjn2iaU_GuyChgWh6wcOKym13EAkAKg9NI1JJOaFn0WyaBYwVmevcK5LkU0VMgjQpnBGQWvUyX_9T0GpUSrBs3F80gzxZdJDpMCiVgFQn",
                        },
                        {
                            name: "Maria Garcia",
                            role: "Chief Technology Officer",
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaiuySVQMWSQjyxPKXkls97hiPMKSmrKh4Bb3z2Rvl27-4kC4sTbt2oZGMVyFm_jAgIahBlmpDftzJCqEL0-a70Xt9IqFsMSNsu3_vjPzLuEh5TNYM1h8YZg-nh613jihHe61L-LhgkDRn7l9On_cZeVplPKjb7N1j7Li_NFMU3nE7xGda4_V7tG9dCaS7zlBUYhidnRF9hbSw1hdeBy1x5dbIOleUWNpQAN6vTi7cGyE3aTXhzuarCmGqb-skEsSdDyaGTIZqhIUA",
                        },
                        {
                            name: "David Chen",
                            role: "Head of Product Design",
                            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIB6jJWEDNPM1GCRLfSjTWMEetPmDXhACRz8NXzzE7Mfvm_4PdbXCULTj1kaFKNapFIbC16kWlgetjtMHqSBaX7-NVyaWiIpfKa8tNJeqWbIXHLLkbEBN8bDjkqlIjB3tmPICEhrIso34XDTVwR2bI0t1XOM9buwOMeEF3U3vTPNz_W10_vZ2TpNPokr6mFdwKtEf2CaCJZg49G5W2Vxm9Q9idif0pTf9-TG8yN_7APDgCnJJU2E8OwqRpm8dtTm6U-Toy5zM1L9qO",
                        },
                    ].map((member, idx) => (
                        <div key={idx} className={styles.teamCard}>
                            <img src={member.img} alt={member.name} />
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
