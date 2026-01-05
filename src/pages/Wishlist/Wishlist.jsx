import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
        window.scrollTo(0, 0);
        dispatch(fetchWishlist());
    }, [dispatch]);

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
        setTimeout(() => {
            dispatch(removeFromWishlist(productId));
            setRemovingId(null);
        }, 300);
    };

    if (loading && safeWishlistItems.length === 0) {
        return (
            <div className={styles.wishlistPage}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading your favorites...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wishlistPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Wishlist</h1>
                    <p>{safeWishlistItems.length} {safeWishlistItems.length === 1 ? 'Product' : 'Products'}</p>
                </div>

                {showFeedback && (
                    <div className={styles.feedbackMessage}>
                        <FaCheck className={styles.feedbackIcon} />
                        <span>Removed from wishlist</span>
                    </div>
                )}

                {safeWishlistItems.length === 0 ? (
                    <div className={styles.emptyWishlist}>
                        <FaHeart size={48} className={styles.emptyIcon} />
                        <h3>Your wishlist is empty</h3>
                        <p>Discover something you love in our marketplace.</p>
                        <Link to="/marketplace" className={styles.browseButton}>
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className={styles.wishlistGrid}>
                        {safeWishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className={`${styles.wishlistCol} ${removingId === item.product_id ? styles.removing : ''}`}
                            >
                                <div className={styles.wishlistCard}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={item.product_image || '/placeholder-image.jpg'}
                                            alt={item.product_title}
                                            className={styles.productImage}
                                        />
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                                            title="Remove"
                                            disabled={removingId === item.product_id}
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3 className={styles.productTitle}>
                                            {item.product_title}
                                        </h3>
                                        <div className={styles.productPrice}>
                                            {item.product_price} EGP
                                        </div>
                                        <Link to={`/product/${item.product_id}`} className={styles.viewButton}>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
