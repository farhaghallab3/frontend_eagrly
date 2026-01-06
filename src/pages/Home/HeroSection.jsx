import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaHandshake, FaArrowRight } from "react-icons/fa";
import { MdTrendingUp, MdVerified, MdSpeed } from "react-icons/md";

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
            {/* Background Elements */}
            <div className={styles.heroBackground}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gridPattern}></div>
            </div>

            <div className={styles.heroContent}>
                <div className={styles.container}>
                    {/* Left: Text & Actions */}
                    <div className={`${styles.heroLeft} ${isVisible ? styles.animate : ''}`}>
                        {/* Badge */}
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeDot}></span>
                            <span>Student Marketplace</span>
                        </div>

                        {/* Title */}
                        <h1 className={styles.heroTitle}>
                            <span className={styles.titleLine}>Quality is Good.</span>
                            <span className={styles.titleLine}>
                                <span className={styles.highlight}>Eagerly</span> Makes it Better.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className={styles.heroSubtitle}>
                            The premier marketplace for students to buy, sell, and exchange
                            pre-owned items. Join our growing community today.
                        </p>

                        {/* CTAs */}
                        <div className={styles.heroCtas}>
                            <Link to="/marketplace" className={styles.ctaPrimary}>
                                Explore Marketplace
                                <FaArrowRight className={styles.ctaIcon} />
                            </Link>
                            <Link to="/register" className={styles.ctaSecondary}>
                                Start Selling
                            </Link>
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

                            {/* Stats Card */}
                            <div className={styles.statsCard}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>5K+</span>
                                    <span className={styles.statLabel}>Users</span>
                                </div>
                                <div className={styles.statDivider}></div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>10K+</span>
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
