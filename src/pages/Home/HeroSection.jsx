import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { MdTrendingUp, MdVerified, MdSpeed } from "react-icons/md";

// React Bits Components
import { BlurText, ShinyText, Magnet, CountUp } from '@components/common/reactbits';

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animations after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        { icon: <MdVerified size={24} />, label: "Verified", desc: "All listings reviewed" },
        { icon: <MdSpeed size={24} />, label: "Fast", desc: "Quick transactions" },
        { icon: <MdTrendingUp size={24} />, label: "Growing", desc: "Join thousands" },
    ];

    return (
        <section className={styles.heroSection}>


            <div className={styles.heroContent}>
                <div className={styles.container}>
                    {/* Left: Text & Actions */}
                    <div className={`${styles.heroLeft} ${isVisible ? styles.animate : ''}`}>
                        {/* Badge with Shiny Text */}
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeDot}></span>
                            <ShinyText
                                text="Student Marketplace"
                                speed={3}
                                className={styles.badgeText}
                            />
                        </div>

                        {/* Title with Blur Text Animation */}
                        <h1 className={styles.heroTitle}>
                            <BlurText
                                text="Quality is Good."
                                delay={80}
                                animateBy="words"
                                direction="top"
                                className={styles.titleLine}
                            />
                            <span className={styles.titleLine}>
                                <span className={styles.highlight}>Stuplies</span>
                                <BlurText
                                    text="Makes it Better."
                                    delay={80}
                                    animateBy="words"
                                    direction="top"
                                    className={styles.titleInline}
                                />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className={styles.heroSubtitle}>
                            The premier marketplace for students to buy, sell, and exchange
                            pre-owned items. Join our growing community today.
                        </p>

                        {/* CTAs with Magnet Effect */}
                        <div className={styles.heroCtas}>
                            <Magnet padding={30} magnetStrength={0.3}>
                                <Link to="/marketplace" className={styles.ctaPrimary}>
                                    Explore Marketplace
                                    <FaArrowRight className={styles.ctaIcon} />
                                </Link>
                            </Magnet>
                            <Magnet padding={30} magnetStrength={0.3}>
                                <Link to="/register" className={styles.ctaSecondary}>
                                    Start Selling
                                </Link>
                            </Magnet>
                        </div>

                        {/* Features Row */}
                        <div className={styles.featuresRow}>
                            {features.map((feature, index) => (
                                <div
                                    key={feature.label}
                                    className={styles.featureItem}
                                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                                >
                                    <div className={styles.featureIcon}>
                                        {feature.icon}
                                    </div>
                                    <div className={styles.featureText}>
                                        <span className={styles.featureLabel}>{feature.label}</span>
                                        <span className={styles.featureDesc}>{feature.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className={`${styles.heroRight} ${isVisible ? styles.animate : ''}`}>
                        <div className={styles.visualContainer}>
                            {/* Floating Cards */}
                            <div className={`${styles.floatingCard} ${styles.card1}`}>
                                <div className={styles.cardIcon}>📚</div>
                                <span>Books</span>
                            </div>
                            <div className={`${styles.floatingCard} ${styles.card2}`}>
                                <div className={styles.cardIcon}>💻</div>
                                <span>Electronics</span>
                            </div>
                            <div className={`${styles.floatingCard} ${styles.card3}`}>
                                <div className={styles.cardIcon}>🎨</div>
                                <span>Art Supplies</span>
                            </div>

                            {/* Main Image */}
                            <div className={styles.mainVisual}>
                                <img
                                    src="https://i.pinimg.com/736x/fb/a3/24/fba3248e68ff2600e1f671ac3f0db687.jpg"
                                    alt="Marketplace Items"
                                    className={styles.heroImage}
                                />
                                <div className={styles.imageGlow}></div>
                            </div>

                            {/* Stats Card with CountUp */}
                            <div className={styles.statsCard}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>
                                        <CountUp
                                            from={0}
                                            to={5}
                                            duration={2}
                                            delay={0.5}
                                            suffix="K+"
                                        />
                                    </span>
                                    <span className={styles.statLabel}>Users</span>
                                </div>
                                <div className={styles.statDivider}></div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>
                                        <CountUp
                                            from={0}
                                            to={10}
                                            duration={2.5}
                                            delay={0.7}
                                            suffix="K+"
                                        />
                                    </span>
                                    <span className={styles.statLabel}>Items</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
