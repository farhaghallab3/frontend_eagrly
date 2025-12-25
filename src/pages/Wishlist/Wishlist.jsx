import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { fetchWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import styles from "./Wishlist.module.css";

export default function Wishlist() {
    const dispatch = useDispatch();
    const wishlistState = useSelector((state) => state.wishlist);
    const wishlistItems = wishlistState?.items?.results || [];
    const { loading } = wishlistState || {};
    const safeWishlistItems = wishlistItems || [];

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    if (loading) {
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
                            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className={styles.wishlistCol}>
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
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <Card.Body className={styles.cardBody}>
                                        <Card.Title className={styles.productTitle}>
                                            {item.product_title}
                                        </Card.Title>
                                        <Card.Text className={styles.productPrice}>
                                            ${item.product_price}
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
