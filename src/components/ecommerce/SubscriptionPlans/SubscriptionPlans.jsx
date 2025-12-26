// src/components/ecommerce/SubscriptionPlans/SubscriptionPlans.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCrown, AiOutlineStar } from "react-icons/ai";
import { MdBolt, MdVerified } from "react-icons/md";
import styles from "./SubscriptionPlans.module.css";
import { packageService } from "../../../services/package";

export default function SubscriptionPlans({ isModal, onClose }) {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSubscribe = (packageId) => {
        // Navigate to checkout page with package ID
        if (onClose) onClose(); // Close modal if in modal mode
        navigate(`/checkout/${packageId}`);
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await packageService.getAll();
                setPackages(data);
            } catch (error) {
                console.error(error); // toast يظهر تلقائي من axios
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

    return (
        <section className={`${styles.plansSection} ${isModal ? styles.plansSectionModal : ''}`}>
            {/* Background elements moved to Home wrapper */}

            <Container id="plans" className={`${styles.plansContainer} ${isModal ? styles.modalContainer : ''}`}>
                <div className={styles.sectionHeader}>
                    {!isModal && (
                        <div className={styles.headerBadge}>
                            <AiOutlineCrown className={styles.badgeIcon} />
                            <span>Pricing Plans</span>
                        </div>
                    )}

                    <h2 className={styles.sectionTitle}>
                        {isModal ? "Upgrade to Continue" : "Choose Your Plan"}
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        {isModal ? "You've reached your ad limit. Subscribe to post more ads." : "Join our community with a plan that suits your needs. Upgrade, downgrade, or cancel anytime."}
                    </p>
                </div>

                <div className={`${styles.plansGrid} ${isModal ? styles.modalGrid : ''}`}>
                    {packages.map((pkg) => {
                        const isPopular = pkg.popular;

                        return (
                            <div
                                key={pkg.id}
                                className={`${styles.planCard} ${isPopular ? styles.planCardPopular : ""}`}
                            >
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

                                <Button
                                    className={`${styles.chooseButton} ${isPopular ? styles.chooseButtonPopular : ""}`}
                                    size="lg"
                                    onClick={() => handleSubscribe(pkg.id)}
                                >
                                    Choose Plan
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ms-2">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            </div>
                        );
                    })}
                </div>


            </Container>
        </section >
    );
}
