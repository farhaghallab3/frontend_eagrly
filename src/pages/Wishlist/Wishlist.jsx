import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaCheck } from "react-icons/fa";
import { fetchWishlist, removeFromWishlist, clearLastAction } from "../../store/slices/wishlistSlice";
import styles from "./Wishlist.module.css";

export default function Wishlist() {
    const dispatch = useDispatch();
    const wishlistState = useSelector((state) => state.wishlist);
    const wishlistItems = wishlistState?.items?.results || [];
    const { loading, lastAction } = wishlistState || {};
    const safeWishlistItems = wishlistItems || [];
    const [removingId, setRemovingId] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        dispatch(fetchWishlist());
    }, [dispatch]);

    // Show feedback when item is removed
    useEffect(() => {
        if (lastAction?.type === 'removed') {
            setShowFeedback(true);
            setTimeout(() => {
                setShowFeedback(false);
                dispatch(clearLastAction());
            }, 2000);
        }
    }, [lastAction, dispatch]);

    const handleRemoveFromWishlist = async (productId) => {
        setRemovingId(productId);
        // Wait for animation before dispatching
        setTimeout(() => {
            dispatch(removeFromWishlist(productId));
            setRemovingId(null);
        }, 300);
    };

    if (loading && safeWishlistItems.length === 0) {
        return (
            <div className={styles.wishlistPage}>
                <Container>
                    <div className={styles.loading}>Loading wishlist...</div>
                </Container>
            </div>
        );
    }

    return (
        <div className={styles.wishlistPage}>
            <Container>
                <div className={styles.header}>
                    <h1>My Wishlist</h1>
                    <p>{safeWishlistItems.length} {safeWishlistItems.length === 1 ? 'item' : 'items'} in your wishlist</p>
                </div>

                {/* Inline feedback message */}
                {showFeedback && (
                    <div className={styles.feedbackMessage}>
                        <FaCheck className={styles.feedbackIcon} />
                        <span>Item removed from wishlist</span>
                    </div>
                )}

                {safeWishlistItems.length === 0 ? (
                    <div className={styles.emptyWishlist}>
                        <FaHeart size={64} className={styles.emptyIcon} />
                        <h3>Your wishlist is empty</h3>
                        <p>Browse our marketplace and add items you love to your wishlist!</p>
                        <Button as={Link} to="/marketplace" className={styles.browseButton}>
                            Browse Marketplace
                        </Button>
                    </div>
                ) : (
                    <Row className={styles.wishlistGrid}>
                        {safeWishlistItems.map((item) => (
                            <Col
                                key={item.id}
                                xs={12} sm={6} md={4} lg={3}
                                className={`${styles.wishlistCol} ${removingId === item.product_id ? styles.removing : ''}`}
                            >
                                <Card className={styles.wishlistCard}>
                                    <div className={styles.imageContainer}>
                                        <Card.Img
                                            variant="top"
                                            src={item.product_image || '/placeholder-image.jpg'}
                                            className={styles.productImage}
                                        />
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                                            title="Remove from wishlist"
                                            disabled={removingId === item.product_id}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <Card.Body className={styles.cardBody}>
                                        <Card.Title className={styles.productTitle}>
                                            {item.product_title}
                                        </Card.Title>
                                        <Card.Text className={styles.productPrice}>
                                            {item.product_price} EGP
                                        </Card.Text>
                                        <Link to={`/product/${item.product_id}`} className={styles.viewButton}>
                                            <span className={styles.buttonText}>View Details</span>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}

