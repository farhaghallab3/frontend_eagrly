// src/components/ecommerce/SubscriptionPlans/SubscriptionPlans.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AiOutlineCheckCircle, AiOutlineCrown, AiOutlineStar } from "react-icons/ai";
import { MdBolt, MdVerified } from "react-icons/md";
import styles from "./SubscriptionPlans.module.css";
import { packageService } from "../../../services/package";

export default function SubscriptionPlans() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <section className={styles.plansSection}>
            <div className="container">
                <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading plans...</p>
                </div>
            </div>
        </section>
    );

    if (!packages.length) return (
        <section className={styles.plansSection}>
            <div className="container text-center">
                <p className={styles.noPlans}>No packages found</p>
            </div>
        </section>
    );

    return (
        <section className={styles.plansSection}>
            <div className={styles.sectionBackground}>
                <div className={styles.bgGlow1}></div>
                <div className={styles.bgGlow2}></div>
                <div className={styles.bgGlow3}></div>
            </div>

            <Container id="plans" className={styles.plansContainer}>
                <div className={styles.sectionHeader}>
                    <div className={styles.headerBadge}>
                        <AiOutlineCrown className={styles.badgeIcon} />
                        <span>Pricing Plans</span>
                    </div>
                    <h2 className={styles.sectionTitle}>
                        Choose Your Plan
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Join our community with a plan that suits your needs. Upgrade, downgrade, or cancel anytime.
                    </p>
                </div>

                <div className={styles.plansGrid}>
                    {packages.map((pkg, index) => {
                        const isPopular = pkg.popular;
                        const isEnterprise = index === packages.length - 1; // Last plan as enterprise

                        return (
                            <div
                                key={pkg.id}
                                className={`${styles.planCard} ${isPopular ? styles.planCardPopular : ""} ${isEnterprise ? styles.planCardEnterprise : ""}`}
                            >
                                {isPopular && (
                                    <div className={styles.popularBadge}>
                                        <AiOutlineStar className={styles.badgeStar} />
                                        <span>Most Popular</span>
                                    </div>
                                )}

                                {isEnterprise && (
                                    <div className={styles.enterpriseBadge}>
                                        <MdVerified className={styles.badgeVerified} />
                                        <span>Enterprise</span>
                                    </div>
                                )}

                                <div className={styles.planHeader}>
                                    <div className={styles.planIcon}>
                                        {isEnterprise ? (
                                            <MdVerified size={32} />
                                        ) : isPopular ? (
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
                                        <span><strong>{pkg.ad_limit}</strong> Ad postings</span>
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
                                    {isEnterprise && (
                                        <>
                                            <li className={styles.featureItem}>
                                                <AiOutlineCheckCircle className={styles.featureIcon} />
                                                <span>Dedicated account manager</span>
                                            </li>
                                            <li className={styles.featureItem}>
                                                <AiOutlineCheckCircle className={styles.featureIcon} />
                                                <span>Custom integrations</span>
                                            </li>
                                        </>
                                    )}
                                </ul>

                                <Button
                                    className={`${styles.chooseButton} ${isPopular ? styles.chooseButtonPopular : ""} ${isEnterprise ? styles.chooseButtonEnterprise : ""}`}
                                    size="lg"
                                >
                                    {isEnterprise ? "Contact Sales" : "Choose Plan"}
                                    {!isEnterprise && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.guaranteeSection}>
                    <div className={styles.guaranteeItem}>
                        <MdVerified className={styles.guaranteeIcon} />
                        <span>30-day money-back guarantee</span>
                    </div>
                    <div className={styles.guaranteeItem}>
                        <AiOutlineCheckCircle className={styles.guaranteeIcon} />
                        <span>Cancel anytime</span>
                    </div>
                    <div className={styles.guaranteeItem}>
                        <AiOutlineCrown className={styles.guaranteeIcon} />
                        <span>Premium support</span>
                    </div>
                </div>
            </Container>
        </section>
    );
}
