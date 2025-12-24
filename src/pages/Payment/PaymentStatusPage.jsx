import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './PaymentStatusPage.module.css';
import ButtonPrimary from '@components/common/ButtonPrimary/ButtonPrimary';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { packageService } from '../../services/package';
import { toast } from 'react-toastify';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const statusParam = searchParams.get('success'); // 'true' or 'false'
    const transactionId = searchParams.get('id');

    // States: 'loading', 'success', 'failure'
    const [verificationStatus, setVerificationStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verify = async () => {
            if (!transactionId) {
                setVerificationStatus('failure');
                setMessage('Invalid payment session.');
                return;
            }

            try {
                // Pass all params to backend for verification
                await packageService.verifyPayment(searchParams.toString());
                setVerificationStatus('success');
                setMessage('Thank you for your purchase. Your order has been confirmed and is being processed.');
                toast.success("Subscription activated!");
            } catch (error) {
                console.error(error);
                setVerificationStatus('failure');
                setMessage('We were unable to verify your payment. Please contact support if you were charged.');
                toast.error("Payment verification failed.");
            }
        };

        verify();
    }, [searchParams, transactionId]);

    const isSuccess = verificationStatus === 'success';
    const isLoading = verificationStatus === 'loading';

    if (isLoading) {
        return (
            <div className={styles.statusPage}>
                <Container className={styles.container}>
                    <Card className={styles.statusCard}>
                        <Card.Body className={`${styles.cardBody} text-center py-5`}>
                            <Spinner animation="border" className="mb-3 text-primary" />
                            <h3>Verifying Payment...</h3>
                            <p>Please wait while we confirm your transaction.</p>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }

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

                        <p className={styles.message}>{message}</p>

                        {isSuccess && transactionId && (
                            <div className={styles.orderInfo}>
                                <div className={styles.infoRow}>
                                    <span>Transaction ID:</span>
                                    <span>{transactionId}</span>
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
                                        onClick={() => {
                                            // If modal was open, we might need to close it or just go to marketplace
                                            navigate('/marketplace');
                                        }}
                                    >
                                        <FaShoppingBag />
                                        Continue Shopping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <ButtonPrimary
                                        text="Try Again"
                                        onClick={() => navigate('/packages')} // Or wherever plans are
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
