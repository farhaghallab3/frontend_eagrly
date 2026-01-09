import React from "react";
import { Container } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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
import SEO from "@components/common/SEO/SEO";

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
            text: "Stuplies is built for students, by students, fostering a supportive academic ecosystem."
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

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: -40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const timelineVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    return (
        <div className={styles.aboutPage}>
            <SEO
                title="About Us"
                description="Learn about Stuplies, the platform built by ITI students for students. Our mission is to empower university students."
                url="/about-us"
            />
            {/* Page Header */}
            <motion.header
                className={styles.aboutHeader}
                initial="hidden"
                animate="visible"
                variants={headerVariants}
            >
                <div className={styles.container}>
                    <h1 className={styles.headerTitle}>About us.</h1>
                </div>
            </motion.header>

            {/* Intro Section */}
            <motion.section
                className={styles.introSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className={styles.container}>
                    <div className={styles.introContent}>
                        <h2>Empowering Students, Fueling Futures.</h2>
                        <p>
                            Stuplies is an ITI Graduation Project developed with passion and precision.
                            Our mission is to create a specialized, high-performance marketplace that
                            caters specifically to the needs of university students across Egypt.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* The Project Section */}
            <motion.section
                className={styles.section}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className={styles.container}>
                    <h3>The Stuplies Project</h3>
                    <p>
                        What started as a requirement for graduation at the Information Technology Institute (ITI)
                        evolved into a full-scale e-commerce solution. We've focused on creating a seamless
                        user experience that combines modern design with powerful functionality, ensuring
                        that every student can find the resources they need with ease.
                    </p>
                </div>
            </motion.section>

            {/* Team Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Meet the Team
                    </motion.h3>
                    <motion.div
                        className={styles.teamGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {teamMembers.map((member, idx) => (
                            <motion.div key={idx} className={styles.teamCard} variants={cardVariants}>
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Values
                    </motion.h3>
                    <motion.div
                        className={styles.valuesGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {values.map((value, idx) => (
                            <motion.div key={idx} className={styles.valueCard} variants={cardVariants}>
                                <div className={styles.iconWrapper}>{value.icon}</div>
                                <div className={styles.valueContent}>
                                    <h4>{value.title}</h4>
                                    <p>{value.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Journey Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Journey
                    </motion.h3>
                    <motion.div
                        className={styles.timeline}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {journey.map((item, idx) => (
                            <motion.div key={idx} className={styles.timelineItem} variants={timelineVariants}>
                                <div className={styles.timelineDot}>{item.icon}</div>
                                <div className={styles.timelineContent}>
                                    <h4>{item.title}</h4>
                                    <span className={styles.timelineDate}>{item.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default AboutUs;
