import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaPaypal, FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { motion } from 'framer-motion';
import SEO from '@components/common/SEO/SEO';
import styles from './CheckoutPage.module.css';
import { packageService } from '../../services/package';
import { toast } from 'react-toastify';
import ButtonPrimary from '@components/common/ButtonPrimary/ButtonPrimary';
import SuccessAnimation from '@components/common/feedback/SuccessAnimation';

const PAYMENT_METHODS = [
    {
        id: 'card',
        name: 'Credit / Debit Card',
        description: 'Visa or Mastercard',
        icon: FaCreditCard,
        brands: ['visa', 'mastercard'],
        available: true
    },
    {
        id: 'wallet',
        name: 'Mobile Wallet',
        description: 'Vodafone, Etisalat, Orange, WE',
        icon: FaMobileAlt,
        wallets: ['vodafone', 'etisalat', 'orange', 'we'],
        available: true
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Direct transfer to account',
        icon: FaUniversity,
        available: true
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with PayPal',
        icon: FaPaypal,
        available: false
    }
];

const CheckoutPage = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showWalletDetails, setShowWalletDetails] = useState(false);
    const [confirmingManualPayment, setConfirmingManualPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const data = await packageService.getById(packageId);
                setPackageData(data);
            } catch (error) {
                console.error('Error fetching package:', error);
                toast.error('Package not found');
                navigate('/packages');
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [packageId, navigate]);

    const handlePayment = async () => {
        if (selectedMethod === 'bank') {
            setShowBankDetails(true);
            setShowWalletDetails(false);
            return;
        }

        if (selectedMethod === 'wallet') {
            setShowWalletDetails(true);
            setShowBankDetails(false);
            return;
        }

        if (selectedMethod === 'paypal') {
            toast.info('PayPal integration coming soon!');
            return;
        }

        try {
            setProcessing(true);
            const response = await packageService.subscribe(packageId);
            const { client_secret } = response;
            const publicKey = import.meta.env.VITE_PAYMOB_PUBLIC_KEY;

            if (client_secret && publicKey) {
                window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${client_secret}`;
            } else {
                toast.error("Unable to initiate payment. Please check configuration.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to process payment. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.checkoutPage}>
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Preparing Checkout...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!packageData) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.checkoutPage}>
            <SEO
                title={packageData ? `Checkout - ${packageData.name}` : 'Checkout'}
                description="Securely complete your subscription upgrade."
                url={`/checkout/${packageId}`}
            />
            <motion.div
                className={styles.container}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.button
                    className={styles.backButton}
                    onClick={() => navigate('/packages')}
                    whileHover={{ x: -5 }}
                    variants={itemVariants}
                >
                    <FaArrowLeft /> Back
                </motion.button>

                <div className={styles.checkoutRow}>
                    <div className={styles.mainCol}>
                        <motion.div className={styles.sectionCard} variants={itemVariants}>
                            <h2 className={styles.sectionTitle}>Payment</h2>
                            <p className={styles.sectionSubtitle}>Select your preferred payment method below.</p>

                            <div className={styles.paymentMethods}>
                                {PAYMENT_METHODS.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`${styles.paymentMethod} ${selectedMethod === method.id ? styles.selected : ''} ${!method.available ? styles.disabled : ''}`}
                                        onClick={() => method.available && setSelectedMethod(method.id)}
                                    >
                                        <div className={styles.methodRadio}>
                                            {selectedMethod === method.id && <FaCheck size={10} />}
                                        </div>
                                        <div className={styles.methodIcon}>
                                            <method.icon />
                                        </div>
                                        <div className={styles.methodInfo}>
                                            <h4>{method.name}</h4>
                                            <p>{method.description}</p>
                                        </div>
                                        {!method.available && (
                                            <span className={styles.comingSoon}>Coming Soon</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {showBankDetails && selectedMethod === 'bank' && (
                                <div className={styles.bankDetails}>
                                    <h4>Bank Transfer</h4>
                                    <div className={styles.bankInfo}>
                                        <div className={styles.bankRow}>
                                            <span>Bank:</span>
                                            <strong>CIB</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Account:</span>
                                            <strong>Stuplies Marketplace</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Number:</span>
                                            <strong>1234567890123456</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Reference:</span>
                                            <strong>PKG-{packageId}</strong>
                                        </div>
                                    </div>
                                    <p className={styles.bankNote}>
                                        Subscription activates within 24h after verification.
                                    </p>
                                    <ButtonPrimary
                                        text={confirmingManualPayment ? "Submitting..." : "Confirm Transfer"}
                                        disabled={confirmingManualPayment}
                                        onClick={async () => {
                                            setConfirmingManualPayment(true);
                                            try {
                                                await packageService.confirmManualPayment(packageId, 'bank');
                                                setShowSuccess(true);
                                                setTimeout(() => navigate('/'), 2500);
                                            } catch {
                                                toast.error('Failed to confirm. Try again.');
                                            } finally {
                                                setConfirmingManualPayment(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {showWalletDetails && selectedMethod === 'wallet' && (
                                <div className={styles.bankDetails}>
                                    <h4>Mobile Wallet</h4>
                                    <div className={styles.bankInfo}>
                                        <div className={styles.bankRow}>
                                            <span>Amount:</span>
                                            <strong>{packageData.price} EGP</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Vodafone:</span>
                                            <strong>010 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Etisalat:</span>
                                            <strong>011 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Orange:</span>
                                            <strong>012 1234 5678</strong>
                                        </div>
                                    </div>
                                    <p className={styles.bankNote}>
                                        Please save your transfer receipt for verification.
                                    </p>
                                    <ButtonPrimary
                                        text={confirmingManualPayment ? "Submitting..." : "Confirm Transfer"}
                                        disabled={confirmingManualPayment}
                                        onClick={async () => {
                                            setConfirmingManualPayment(true);
                                            try {
                                                await packageService.confirmManualPayment(packageId, 'wallet');
                                                setShowSuccess(true);
                                                setTimeout(() => navigate('/'), 2500);
                                            } catch {
                                                toast.error('Failed to confirm. Try again.');
                                            } finally {
                                                setConfirmingManualPayment(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <div className={styles.sidebarCol}>
                        <motion.div className={styles.orderSummary} variants={itemVariants}>
                            <h3 className={styles.summaryTitle}>Summary</h3>

                            <div className={styles.packageInfo}>
                                <div className={styles.packageHeader}>
                                    <h4>{packageData.name}</h4>
                                    {packageData.popular && <span className={styles.popularBadge}>POPULAR</span>}
                                </div>
                                <p className={styles.packageDesc}>{packageData.description}</p>
                            </div>

                            <div className={styles.summaryDivider}></div>

                            <ul className={styles.featuresList}>
                                <li>
                                    <FaCheck className={styles.checkIcon} />
                                    <span><strong>{packageData.ad_limit >= 999 ? 'Unlimited' : packageData.ad_limit}</strong> AD LIMIT</span>
                                </li>
                                <li>
                                    <FaCheck className={styles.checkIcon} />
                                    <span><strong>{packageData.featured_ad_limit || 0}</strong> FEATURED ADS</span>
                                </li>
                                <li>
                                    <FaCheck className={styles.checkIcon} />
                                    <span><strong>{packageData.duration_in_days}</strong> DAYS VALIDITY</span>
                                </li>
                            </ul>

                            <div className={styles.summaryDivider}></div>

                            <div className={styles.priceBreakdown}>
                                <div className={styles.priceRow}>
                                    <span>TOTAL</span>
                                    <span className={styles.totalPrice}>{packageData.price} EGP</span>
                                </div>
                            </div>

                            <motion.button
                                className={styles.payButton}
                                onClick={handlePayment}
                                disabled={processing}
                                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(255, 215, 0, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {processing ? 'Processing...' :
                                    selectedMethod === 'bank' ? 'View Details' :
                                        selectedMethod === 'wallet' ? 'View Numbers' :
                                            `Subscribe Now`}
                            </motion.button>

                            <p className={styles.secureNote}>
                                <FaLock size={12} /> Secure 256-bit Encryption
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div >

            {showSuccess && (
                <SuccessAnimation message="Subscription requested! We'll notify you once verified." />
            )}
        </div >
    );
};

export default CheckoutPage;
