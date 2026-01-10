import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCrown, AiOutlineStar } from "react-icons/ai";
import { MdBolt } from "react-icons/md";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./SubscriptionPlans.module.css";
import { packageService } from "../../../services/package";

// React Bits Components
import { SplitText, SpotlightCard, ShinyText } from '@components/common/reactbits';

export default function SubscriptionPlans({ isModal, onClose }) {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSubscribe = (packageId) => {
        if (onClose) onClose();
        navigate(`/checkout/${packageId}`);
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await packageService.getAll();
                setPackages(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    if (loading) return (
        <section className={`${styles.plansSection} ${isModal ? styles.plansSectionModal : ''}`}>
            <div className="container">
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading plans...</p>
                </div>
            </div>
        </section>
    );

    if (!packages.length) return (
        <section className={`${styles.plansSection} ${isModal ? styles.plansSectionModal : ''}`}>
            <div className="container text-center">
                <p className={styles.noPlans}>No packages found</p>
            </div>
        </section>
    );

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: 40 },
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
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1
            }
        }
    };

    return (
        <section className={`${styles.plansSection} ${isModal ? styles.plansSectionModal : ''}`}>
            <Container id="plans" className={`${styles.sectionContainer} ${isModal ? styles.modalContainer : ''}`}>
                {!isModal && (
                    <motion.div
                        className={styles.sectionHeader}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={headerVariants}
                    >
                        <div className={styles.headerBadge}>
                            <ShinyText text="Featured Collection" speed={4} />
                        </div>

                        {/* SplitText Animation for Title */}
                        <SplitText
                            text="Pricing Plans"
                            className={styles.sectionTitle}
                            delay={50}
                            splitBy="letter"
                            animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }}
                            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                        />

                        <p className={styles.sectionSubtitle}>
                            Join our community with a plan that suits your needs. Upgrade, downgrade, or cancel anytime.
                        </p>
                    </motion.div>
                )}

                <motion.div
                    className={`${styles.plansGrid} ${isModal ? styles.modalGrid : ''}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    {packages.map((pkg) => {
                        const isPopular = pkg.popular;

                        return (
                            <motion.div
                                key={pkg.id}
                                variants={cardVariants}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* SpotlightCard for Premium Card Effect */}
                                <SpotlightCard
                                    className={styles.spotlightWrapper}
                                    spotlightColor={isPopular ? "rgba(255, 179, 0, 0.3)" : "rgba(255, 179, 0, 0.15)"}
                                    spotlightSize={400}
                                >
                                    <div className={`${styles.planCard} ${isPopular ? styles.planCardPopular : ""}`}>
                                        {isPopular && (
                                            <div className={styles.popularBadge}>
                                                <AiOutlineStar className={styles.badgeStar} />
                                                <span>Most Popular</span>
                                            </div>
                                        )}

                                        <div className={styles.planHeader}>
                                            <div className={styles.planIcon}>
                                                {isPopular ? (
                                                    <AiOutlineCrown size={32} />
                                                ) : (
                                                    <MdBolt size={32} />
                                                )}
                                            </div>
                                            <h3 className={styles.planTitle}>{pkg.name}</h3>
                                        </div>

                                        <div className={styles.planPrice}>
                                            <div className={styles.priceWrapper}>
                                                <span className={styles.priceValue}>{pkg.price}</span>
                                                <span className={styles.currency}> EGP</span>
                                            </div>
                                            <span className={styles.pricePeriod}>
                                                / {pkg.duration_in_days} days
                                            </span>
                                        </div>

                                        <div className={styles.planDivider}></div>

                                        <ul className={styles.featuresList}>
                                            <li className={styles.featureItem}>
                                                <AiOutlineCheckCircle className={styles.featureIcon} />
                                                <span><strong>{pkg.ad_limit >= 999 ? "Unlimited" : pkg.ad_limit}</strong> Ad postings</span>
                                            </li>
                                            {pkg.featured_ad_limit !== null && (
                                                <li className={styles.featureItem}>
                                                    <AiOutlineCheckCircle className={styles.featureIcon} />
                                                    <span><strong>{pkg.featured_ad_limit}</strong> Featured ads</span>
                                                </li>
                                            )}
                                            {pkg.description && (
                                                <li className={styles.featureItem}>
                                                    <AiOutlineCheckCircle className={styles.featureIcon} />
                                                    <span>{pkg.description}</span>
                                                </li>
                                            )}
                                            <li className={styles.featureItem}>
                                                <AiOutlineCheckCircle className={styles.featureIcon} />
                                                <span>Priority support</span>
                                            </li>
                                            <li className={styles.featureItem}>
                                                <AiOutlineCheckCircle className={styles.featureIcon} />
                                                <span>Analytics dashboard</span>
                                            </li>
                                            {isPopular && (
                                                <li className={styles.featureItem}>
                                                    <AiOutlineCheckCircle className={styles.featureIcon} />
                                                    <span>Advanced analytics</span>
                                                </li>
                                            )}
                                        </ul>

                                        <button
                                            className={`${styles.chooseButton} ${isPopular ? styles.chooseButtonPopular : ""}`}
                                            onClick={() => handleSubscribe(pkg.id)}
                                        >
                                            Choose Plan
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ms-2">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}
