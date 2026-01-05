import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTag, FaBuilding, FaGraduationCap, FaHeart, FaShare, FaChevronRight } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import ShareModal from "@components/common/ShareModal/ShareModal";

import { useAuth } from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";
import { findOrCreateChat } from "../../services/chatService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../store/slices/wishlistSlice";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeImage, setActiveImage] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openAuthModal } = useAuthModal();
    const dispatch = useDispatch();
    const wishlistState = useSelector((state) => state.wishlist);
    const wishlistItems = wishlistState?.items?.results || [];

    const isInWishlist = wishlistItems.some(item => item.product_id === parseInt(id));

    const handleWishlistToggle = () => {
        if (!user) {
            openAuthModal();
            return;
        }
        dispatch(toggleWishlist(parseInt(id)));
    };

    const handleContactSeller = async () => {
        if (!user) {
            openAuthModal();
            return;
        }

        if (!product?.seller?.id) {
            console.error("Seller information missing", product);
            toast.error("Cannot contact seller: Owner information is unavailable.");
            return;
        }

        try {
            const chat = await findOrCreateChat(product.id, product.seller.id, user.id);

            if (chat && chat.id) {
                navigate(`/chat/${chat.id}`);
            } else {
                console.error("Chat created but returned no ID:", chat);
                toast.error("Error: Could not retrieve chat details.");
            }
        } catch (error) {
            console.error("Error contacting seller:", error);
            const msg = error.response?.data?.error || "Failed to start chat with seller.";
            toast.error(msg);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductDetails(id);
                setProduct(data);
                setActiveImage(data.image || data.images?.[0] || '/placeholder-image.jpg');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className={styles.productPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading...</p>
        </div>
    );

    if (!product) return (
        <div className={styles.productPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Product not found.</p>
        </div>
    );

    // Combine main image and gallery images for the full list
    const allImages = [product.image, ...(product.images || [])].filter(Boolean);
    // Remove duplicates if any
    const uniqueImages = [...new Set(allImages)];

    return (
        <div className={styles.productPage}>
            {/* Breadcrumb Navigation */}
            <div className={styles.breadcrumbContainer}>
                <div className={styles.container}>
                    <nav className={styles.breadcrumb}>
                        <Link to="/">Home</Link>
                        <FaChevronRight className={styles.separator} size={10} />
                        <Link to="/marketplace">Marketplace</Link>
                        <FaChevronRight className={styles.separator} size={10} />
                        <span className={styles.currentPath}>{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.productGrid}>
                    {/* Left: Product Gallery */}
                    <div className={styles.gallerySection}>
                        <div className={styles.mainImageWrapper}>
                            <img src={activeImage} alt={product.title} className={styles.mainImage} />
                        </div>

                        {uniqueImages.length > 1 && (
                            <div className={styles.thumbnailColumn}>
                                {uniqueImages.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.thumbnailWrapper} ${activeImage === img ? styles.active : ''}`}
                                        onClick={() => setActiveImage(img)}
                                    >
                                        <img src={img} alt={`${product.title} thumbnail ${i}`} className={styles.thumbnailImage} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className={styles.infoSection}>
                        <div className={styles.productHeader}>
                            <span className={styles.categoryLabel}>{product.category_name}</span>
                            <h1 className={styles.productTitle}>{product.title}</h1>
                            <div className={styles.price}>{product.price} EGP</div>
                        </div>

                        <div className={styles.descriptionSection}>
                            <h3>Description</h3>
                            <p className={styles.descriptionText}>{product.description}</p>
                        </div>

                        <div className={styles.specsSection}>
                            <h3>Product Details</h3>
                            <div className={styles.specsGrid}>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Condition</span>
                                    <span className={styles.specValue}>{product.condition || 'Used'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>University</span>
                                    <span className={styles.specValue}>{product.university || 'N/A'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Faculty</span>
                                    <span className={styles.specValue}>{product.faculty || 'N/A'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Listed On</span>
                                    <span className={styles.specValue}>
                                        {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seller Information */}
                        <div className={styles.sellerSection}>
                            <div className={styles.sellerCard}>
                                <div className={styles.sellerHeader}>
                                    <div className={styles.sellerAvatar}>
                                        <FaUser />
                                    </div>
                                    <h4>Seller Information</h4>
                                </div>
                                <div className={styles.sellerInfoGrid}>
                                    <div className={styles.infoItem}>
                                        <FaUser />
                                        <span>{product.seller?.first_name || 'Seller'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <FaMapMarkerAlt />
                                        <span>{product.university || 'Location N/A'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <FaPhone />
                                        <span>{product.seller?.phone || 'Private'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <FaEnvelope />
                                        <span>{product.seller?.email || 'Private'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className={styles.stickyBar}>
                <div className={styles.stickyContainer}>
                    <div className={styles.stickyLeft}>
                        <span className={styles.stickyTitle}>{product.title}</span>
                        <span className={styles.stickyPrice}>{product.price} EGP</span>
                    </div>
                    <div className={styles.stickyActions}>
                        <button
                            className={`${styles.wishlistBtn} ${isInWishlist ? styles.wishlistActive : ''}`}
                            onClick={handleWishlistToggle}
                            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <FaHeart />
                        </button>
                        <button className={styles.contactBtn} onClick={handleContactSeller}>
                            Contact Seller
                        </button>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                show={showShareModal}
                onHide={() => setShowShareModal(false)}
                productUrl={window.location.href}
                productName={product.title}
            />
        </div>
    );
}
