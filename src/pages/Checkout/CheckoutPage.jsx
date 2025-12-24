import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutPage.module.css';
import ButtonPrimary from '@components/common/ButtonPrimary/ButtonPrimary';
import FormInput from '@components/common/forms/FormInput/FormInput';
import { FaCreditCard, FaWallet, FaShieldAlt, FaShoppingCart } from 'react-icons/fa';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Mock data - in a real app, this would come from a cart/product state
    const orderItems = [
        { id: 1, title: 'Advanced Calculus Textbook', price: 450, quantity: 1 },
        { id: 2, title: 'Scientific Calculator', price: 1200, quantity: 1 }
    ];

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 50;
    const total = subtotal + shipping;

    const handlePayment = (e) => {
        e.preventDefault();
        // Here you would typically call your backend to initiate Paymob payment
        // For now, we'll just simulate a successful redirect
        console.log('Initiating payment with method:', paymentMethod);
        navigate('/payment-status?status=success');
    };

    return (
        <div className={styles.checkoutPage}>
            <Container>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Secure Checkout</h1>
                    <p className={styles.subtitle}>Complete your purchase securely via Paymob</p>
                </div>

                <Row className={styles.checkoutRow}>
                    <Col lg={7} className={styles.formColumn}>
                        <Card className={styles.checkoutCard}>
                            <Card.Body>
                                <h3 className={styles.sectionTitle}>Shipping Information</h3>
                                <div className={styles.formGrid}>
                                    <FormInput label="Full Name" placeholder="John Doe" />
                                    <FormInput label="Phone Number" placeholder="+20 123 456 7890" />
                                    <FormInput label="Email Address" placeholder="john@example.com" />
                                    <FormInput label="Shipping Address" placeholder="123 University St, Cairo" />
                                </div>

                                <h3 className={styles.sectionTitle}>Payment Method</h3>
                                <div className={styles.paymentMethods}>
                                    <div 
                                        className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.active : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <FaCreditCard className={styles.methodIcon} />
                                        <span>Credit / Debit Card</span>
                                        <div className={styles.radio}></div>
                                    </div>
                                    <div 
                                        className={`${styles.paymentOption} ${paymentMethod === 'wallet' ? styles.active : ''}`}
                                        onClick={() => setPaymentMethod('wallet')}
                                    >
                                        <FaWallet className={styles.methodIcon} />
                                        <span>Mobile Wallet (Vodafone Cash, etc.)</span>
                                        <div className={styles.radio}></div>
                                    </div>
                                </div>

                                <div className={styles.secureBadge}>
                                    <FaShieldAlt />
                                    <span>Your payment is secured by Paymob SSL encryption</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={5} className={styles.summaryColumn}>
                        <Card className={styles.summaryCard}>
                            <Card.Body>
                                <div className={styles.summaryHeader}>
                                    <FaShoppingCart />
                                    <h3>Order Summary</h3>
                                </div>

                                <div className={styles.orderItems}>
                                    {orderItems.map(item => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemTitle}>{item.title}</span>
                                                <span className={styles.itemQty}>Qty: {item.quantity}</span>
                                            </div>
                                            <span className={styles.itemPrice}>EGP {item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.summaryDivider}></div>

                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>EGP {subtotal}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span>EGP {shipping}</span>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <span>Total</span>
                                    <span>EGP {total}</span>
                                </div>

                                <ButtonPrimary 
                                    text={`Pay EGP ${total}`} 
                                    onClick={handlePayment}
                                    className={styles.payButton}
                                    fullWidth
                                />
                                
                                <p className={styles.termsText}>
                                    By clicking Pay, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CheckoutPage;
