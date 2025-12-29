import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaPaypal, FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import styles from './CheckoutPage.module.css';
import { packageService } from '../../services/package';
import { toast } from 'react-toastify';
import ButtonPrimary from '@components/common/ButtonPrimary/ButtonPrimary';

const PAYMENT_METHODS = [
    {
        id: 'card',
        name: 'Credit / Debit Card',
        description: 'Pay securely with Visa or Mastercard',
        icon: FaCreditCard,
        brands: ['visa', 'mastercard'],
        available: true
    },
    {
        id: 'wallet',
        name: 'Mobile Wallet',
        description: 'Vodafone Cash, Etisalat Cash, Orange Money, WE Pay',
        icon: FaMobileAlt,
        wallets: ['vodafone', 'etisalat', 'orange', 'we'],
        available: true
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Direct bank transfer to our account',
        icon: FaUniversity,
        available: true
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: FaPaypal,
        available: false // Coming soon
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
                // Redirect to Paymob checkout
                window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${client_secret}`;
            } else {
                console.error("Missing payment config", { client_secret, publicKey });
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
                <Container className={styles.container}>
                    <div className={styles.loadingState}>
                        <Spinner animation="border" variant="primary" />
                        <p>Loading checkout...</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (!packageData) {
        return null;
    }

    return (
        <div className={styles.checkoutPage}>
            <Container className={styles.container}>
                {/* Back Button */}
                <button className={styles.backButton} onClick={() => navigate('/packages')}>
                    <FaArrowLeft /> Back to Plans
                </button>

                <Row className={styles.checkoutRow}>
                    {/* Main Content - Payment Methods */}
                    <Col lg={7} className={styles.mainCol}>
                        <div className={styles.sectionCard}>
                            <h2 className={styles.sectionTitle}>Select Payment Method</h2>
                            <p className={styles.sectionSubtitle}>Choose your preferred payment method. You'll complete the payment on our secure payment partner's page.</p>

                            <div className={styles.paymentMethods}>
                                {PAYMENT_METHODS.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`${styles.paymentMethod} ${selectedMethod === method.id ? styles.selected : ''} ${!method.available ? styles.disabled : ''}`}
                                        onClick={() => method.available && setSelectedMethod(method.id)}
                                    >
                                        <div className={styles.methodRadio}>
                                            {selectedMethod === method.id && <FaCheck />}
                                        </div>
                                        <div className={styles.methodIcon}>
                                            <method.icon />
                                        </div>
                                        <div className={styles.methodInfo}>
                                            <h4>{method.name}</h4>
                                            <p>{method.description}</p>
                                            {method.brands && (
                                                <div className={styles.brandIcons}>
                                                    <SiVisa className={styles.brandIcon} title="Visa" />
                                                    <SiMastercard className={styles.brandIcon} title="Mastercard" />
                                                </div>
                                            )}
                                            {method.wallets && (
                                                <div className={styles.walletLogos}>
                                                    <span className={styles.walletBadge}>Vodafone Cash</span>
                                                    <span className={styles.walletBadge}>Etisalat Cash</span>
                                                    <span className={styles.walletBadge}>Orange</span>
                                                    <span className={styles.walletBadge}>WE Pay</span>
                                                </div>
                                            )}
                                        </div>
                                        {!method.available && (
                                            <span className={styles.comingSoon}>Coming Soon</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Bank Details Modal/Section */}
                            {showBankDetails && selectedMethod === 'bank' && (
                                <div className={styles.bankDetails}>
                                    <h4>Bank Transfer Details</h4>
                                    <div className={styles.bankInfo}>
                                        <div className={styles.bankRow}>
                                            <span>Bank Name:</span>
                                            <strong>Commercial International Bank (CIB)</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Account Name:</span>
                                            <strong>Eagerly Marketplace Ltd</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Account Number:</span>
                                            <strong>1234567890123456</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>IBAN:</span>
                                            <strong>EG123456789012345678901234</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>Reference:</span>
                                            <strong>PKG-{packageId}-{Date.now()}</strong>
                                        </div>
                                    </div>
                                    <p className={styles.bankNote}>
                                        Please include the reference number in your transfer. Your subscription will be activated within 24 hours after we confirm your payment.
                                    </p>
                                    <ButtonPrimary
                                        text={confirmingManualPayment ? "Submitting..." : "I've Made the Transfer"}
                                        disabled={confirmingManualPayment}
                                        onClick={async () => {
                                            setConfirmingManualPayment(true);
                                            try {
                                                await packageService.confirmManualPayment(packageId, 'bank');
                                                toast.success('Thank you! We will verify your payment and activate your subscription within 24 hours.');
                                                navigate('/profile');
                                            } catch (error) {
                                                toast.error('Failed to submit payment confirmation. Please try again.');
                                            } finally {
                                                setConfirmingManualPayment(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Mobile Wallet Details Section */}
                            {showWalletDetails && selectedMethod === 'wallet' && (
                                <div className={styles.bankDetails}>
                                    <h4>Mobile Wallet Transfer</h4>
                                    <p className={styles.bankNote} style={{ marginTop: 0, marginBottom: '1rem' }}>
                                        Send <strong>{packageData.price} EGP</strong> to one of the following numbers. Make sure to save the transfer receipt.
                                    </p>
                                    <div className={styles.bankInfo}>
                                        <div className={styles.bankRow}>
                                            <span>🔴 Vodafone Cash:</span>
                                            <strong style={{ direction: 'ltr' }}>010 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>🟢 Etisalat Cash:</span>
                                            <strong style={{ direction: 'ltr' }}>011 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>🟠 Orange Money:</span>
                                            <strong style={{ direction: 'ltr' }}>012 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow}>
                                            <span>🟣 WE Pay:</span>
                                            <strong style={{ direction: 'ltr' }}>015 1234 5678</strong>
                                        </div>
                                        <div className={styles.bankRow} style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(39, 231, 221, 0.3)', paddingTop: '0.75rem' }}>
                                            <span>Reference:</span>
                                            <strong>PKG-{packageId}-{Date.now().toString().slice(-6)}</strong>
                                        </div>
                                    </div>
                                    <p className={styles.bankNote}>
                                        Include the reference in the transfer notes. Your subscription will be activated within 24 hours after confirmation.
                                    </p>
                                    <ButtonPrimary
                                        text={confirmingManualPayment ? "Submitting..." : "I've Made the Transfer"}
                                        disabled={confirmingManualPayment}
                                        onClick={async () => {
                                            setConfirmingManualPayment(true);
                                            try {
                                                await packageService.confirmManualPayment(packageId, 'wallet');
                                                toast.success('Thank you! We will verify your payment and activate your subscription within 24 hours.');
                                                navigate('/profile');
                                            } catch (error) {
                                                toast.error('Failed to submit payment confirmation. Please try again.');
                                            } finally {
                                                setConfirmingManualPayment(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Sidebar - Order Summary */}
                    <Col lg={5} className={styles.sidebarCol}>
                        <div className={styles.orderSummary}>
                            <h3 className={styles.summaryTitle}>Order Summary</h3>

                            <div className={styles.packageInfo}>
                                <div className={styles.packageHeader}>
                                    <h4>{packageData.name}</h4>
                                    {packageData.popular && <span className={styles.popularBadge}>Popular</span>}
                                </div>
                                <p className={styles.packageDesc}>{packageData.description}</p>
                            </div>

                            <div className={styles.summaryDivider}></div>

                            <ul className={styles.featuresList}>
                                <li>
                                    <FaCheck className={styles.checkIcon} />
                                    <span><strong>{packageData.ad_limit >= 999 ? 'Unlimited' : packageData.ad_limit}</strong> Ad postings</span>
                                </li>
                                {packageData.featured_ad_limit !== null && (
                                    <li>
                                        <FaCheck className={styles.checkIcon} />
                                        <span><strong>{packageData.featured_ad_limit}</strong> Featured ads</span>
                                    </li>
                                )}
                                <li>
                                    <FaCheck className={styles.checkIcon} />
                                    <span><strong>{packageData.duration_in_days}</strong> Days validity</span>
                                </li>
                            </ul>

                            <div className={styles.summaryDivider}></div>

                            <div className={styles.priceBreakdown}>
                                <div className={styles.priceRow}>
                                    <span>Subtotal</span>
                                    <span>{packageData.price} EGP</span>
                                </div>
                                <div className={styles.priceRow}>
                                    <span>Tax</span>
                                    <span>0 EGP</span>
                                </div>
                                <div className={`${styles.priceRow} ${styles.totalRow}`}>
                                    <span>Total</span>
                                    <span className={styles.totalPrice}>{packageData.price} EGP</span>
                                </div>
                            </div>

                            <button
                                className={styles.payButton}
                                onClick={handlePayment}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="me-2" />
                                        {selectedMethod === 'bank' ? 'View Bank Details' :
                                            selectedMethod === 'wallet' ? 'View Wallet Numbers' :
                                                `Pay ${packageData.price} EGP`}
                                    </>
                                )}
                            </button>

                            <p className={styles.secureNote}>
                                <FaLock /> Your payment is secured by 256-bit SSL encryption
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CheckoutPage;
