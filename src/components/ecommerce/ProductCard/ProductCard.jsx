import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { toggleWishlist } from "../../../store/slices/wishlistSlice";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthModal } from "../../../context/AuthModalContext";
import styles from "./ProductCard.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
import SuccessAnimation from "../../common/feedback/SuccessAnimation";

export default function ProductCard({ product }) {
    const { id, title, description, image, buttonText = "Overview", name } = product;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { openAuthModal } = useAuthModal();
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    const wishlistState = useSelector((state) => state.wishlist);
    const wishlistItems = wishlistState?.items?.results || [];
    const isInWishlist = wishlistItems.some(item => item.product_id === (id || product._id));

    const handleClick = () => {
        if (product.seller) {
            navigate(`/product/${id || product._id}`);
        } else {
            navigate(`/categories/${id || product._id}/products`);
        }
    };

    const handleWishlistToggle = async (e) => {
        e.stopPropagation();
        if (!user) {
            openAuthModal();
            return;
        }

        // Optimistic update handled by slice, but animation depends on result
        try {
            const resultAction = await dispatch(toggleWishlist(id || product._id));
            if (toggleWishlist.fulfilled.match(resultAction)) {
                if (resultAction.payload.status === 'added') {
                    setShowSuccessAnimation(true);
                    setTimeout(() => setShowSuccessAnimation(false), 2000);
                }
            }
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
        }
    };

    return (
        <>
            {showSuccessAnimation && <SuccessAnimation message="Added to Wishlist!" />}
            <div
                className={`${styles.card} d-flex flex-column justify-content-between p-3`}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                <div>
                    <div className={styles.imageContainer}>
                        <div
                            className={styles.image}
                            style={{ backgroundImage: `url(${image})` }}
                        ></div>
                        <button
                            className={`${styles.wishlistButton} ${isInWishlist ? styles.wishlistActive : ''}`}
                            onClick={handleWishlistToggle}
                            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <FaHeart />
                        </button>
                    </div>
                    <div className="mt-3">
                        <p className={styles.title}>{title}{name}</p>
                        <p className={styles.desc}>{description}</p>
                    </div>
                </div>
                <ButtonPrimary text={buttonText} onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }} />
            </div>
        </>
    );
}
