import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './PaymentStatusPage.module.css';
import ButtonPrimary from '@components/common/ButtonPrimary/ButtonPrimary';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status'); // 'success' or 'failure'

    const isSuccess = status === 'success';

    return (
        <div className={styles.statusPage}>
            <Container className={styles.container}>
                <Card className={`${styles.statusCard} ${isSuccess ? styles.successCard : styles.failureCard}`}>
                    <Card.Body className={styles.cardBody}>
                        <div className={styles.iconWrapper}>
                            {isSuccess ? (
                                <FaCheckCircle className={styles.successIcon} />
                            ) : (
                                <FaTimesCircle className={styles.failureIcon} />
                            )}
                        </div>

                        <h1 className={styles.title}>
                            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                        </h1>

                        <p className={styles.message}>
                            {isSuccess
                                ? 'Thank you for your purchase. Your order has been confirmed and is being processed.'
                                : 'We were unable to process your payment. Please try again or use a different payment method.'}
                        </p>

                        {isSuccess && (
                            <div className={styles.orderInfo}>
                                <div className={styles.infoRow}>
                                    <span>Order Number:</span>
                                    <span>#EAG-123456</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span>Transaction ID:</span>
                                    <span>PAY-987654321</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.actionButtons}>
                            {isSuccess ? (
                                <>
                                    <ButtonPrimary
                                        text="View My Orders"
                                        onClick={() => navigate('/dashboard')}
                                        className={styles.primaryBtn}
                                    />
                                    <button
                                        className={styles.secondaryBtn}
                                        onClick={() => navigate('/marketplace')}
                                    >
                                        <FaShoppingBag />
                                        Continue Shopping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <ButtonPrimary
                                        text="Try Again"
                                        onClick={() => navigate('/checkout')}
                                        className={styles.primaryBtn}
                                    />
                                    <button
                                        className={styles.secondaryBtn}
                                        onClick={() => navigate('/marketplace')}
                                    >
                                        <FaArrowLeft />
                                        Back to Marketplace
                                    </button>
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default PaymentStatusPage;
