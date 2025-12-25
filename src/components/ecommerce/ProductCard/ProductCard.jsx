import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { toggleWishlist } from "../../../store/slices/wishlistSlice";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./ProductCard.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";

export default function ProductCard({ product }) {
    const { id, title, description, image, buttonText = "Overview", name } = product;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();

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

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate("/login");
            return;
        }
        dispatch(toggleWishlist(id || product._id));
    };

    return (
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
    );
}
