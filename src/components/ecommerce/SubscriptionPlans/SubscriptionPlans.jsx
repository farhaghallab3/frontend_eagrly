// src/components/ecommerce/SubscriptionPlans/SubscriptionPlans.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { AiOutlineCheckCircle, AiOutlineCrown, AiOutlineStar } from "react-icons/ai";
import { MdBolt, MdVerified } from "react-icons/md";
import styles from "./SubscriptionPlans.module.css";
import { packageService } from "../../../services/package";

export default function SubscriptionPlans({ isModal }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribingId, setSubscribingId] = useState(null);

    const handleSubscribe = async (packageId) => {
        try {
            setSubscribingId(packageId);
            const response = await packageService.subscribe(packageId);
            const { client_secret } = response;
            const publicKey = import.meta.env.VITE_PAYMOB_PUBLIC_KEY;

            if (client_secret && publicKey) {
                window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${client_secret}`;
            } else {
                console.error("Missing payment config", { client_secret, publicKey });
                // Fallback or alert
                alert("Unable to initiate payment. Please contact support.");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Failed to process subscription. Please try again.");
        } finally {
            setSubscribingId(null);
        }
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
                                        <span className={styles.currency}>$</span>
                                        <span className={styles.priceValue}>{pkg.price}</span>
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
                                    disabled={!!subscribingId}
                                >
                                    {subscribingId === pkg.id ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Choose Plan
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ms-2">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>


            </Container>
        </section>
    );
}
