import React from "react";
import { Container } from "react-bootstrap";
import {
    FaRocket,
    FaLightbulb,
    FaUsers,
    FaShieldAlt,
    FaHandshake,
    FaGraduationCap,
    FaCode,
    FaPalette,
    FaCheckCircle
} from "react-icons/fa";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
    const teamMembers = [
        { name: "Ahmed", role: "Developer / ITI Student" },
        { name: "Farha", role: "Developer / ITI Student" },
        { name: "Kamel", role: "Developer / ITI Student" },
        { name: "Kareem", role: "Developer / ITI Student" }
    ];

    const values = [
        {
            icon: <FaLightbulb />,
            title: "Innovation",
            text: "We leverage modern technologies to solve real-world problems for students."
        },
        {
            icon: <FaUsers />,
            title: "Community",
            text: "Eagerly is built for students, by students, fostering a supportive academic ecosystem."
        },
        {
            icon: <FaGraduationCap />,
            title: "Education",
            text: "Our project is a testament to the high-quality training provided by ITI."
        },
        {
            icon: <FaHandshake />,
            title: "Trust",
            text: "We ensure a secure and transparent marketplace for all our university users."
        }
    ];

    const journey = [
        { icon: <FaLightbulb />, title: "Concept & Research", date: "Initial Phase" },
        { icon: <FaPalette />, title: "Design & UX Strategy", date: "Design Phase" },
        { icon: <FaCode />, title: "Full-Stack Development", date: "Implementation Phase" },
        { icon: <FaRocket />, title: "Final Launch", date: "ITI Graduation" }
    ];

    return (
        <div className={styles.aboutPage}>
            {/* Page Header */}
            <header className={styles.aboutHeader}>
                <div className={styles.container}>
                    <h1 className={styles.headerTitle}>About us.</h1>
                </div>
            </header>

            {/* Intro Section */}
            <section className={styles.introSection}>
                <div className={styles.container}>
                    <div className={styles.introContent}>
                        <h2>Empowering Students, Fueling Futures.</h2>
                        <p>
                            Eagerly is an ITI Graduation Project developed with passion and precision.
                            Our mission is to create a specialized, high-performance marketplace that
                            caters specifically to the needs of university students across Egypt.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Project Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h3>The Eagerly Project</h3>
                    <p style={{ color: '#666', maxWidth: '800px', lineHeight: '1.8' }}>
                        What started as a requirement for graduation at the Information Technology Institute (ITI)
                        evolved into a full-scale e-commerce solution. We've focused on creating a seamless
                        user experience that combines modern design with powerful functionality, ensuring
                        that every student can find the resources they need with ease.
                    </p>
                </div>
            </section>

            {/* Team Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h3>Meet the Team</h3>
                    <div className={styles.teamGrid}>
                        {teamMembers.map((member, idx) => (
                            <div key={idx} className={styles.teamCard}>
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h3>Our Values</h3>
                    <div className={styles.valuesGrid}>
                        {values.map((value, idx) => (
                            <div key={idx} className={styles.valueCard}>
                                <div className={styles.iconWrapper}>{value.icon}</div>
                                <div className={styles.valueContent}>
                                    <h4>{value.title}</h4>
                                    <p>{value.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h3>Our Journey</h3>
                    <div className={styles.timeline}>
                        {journey.map((item, idx) => (
                            <div key={idx} className={styles.timelineItem}>
                                <div className={styles.timelineDot}>{item.icon}</div>
                                <div className={styles.timelineContent}>
                                    <h4>{item.title}</h4>
                                    <span className={styles.timelineDate}>{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default AboutUs;
