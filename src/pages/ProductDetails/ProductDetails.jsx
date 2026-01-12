import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { productService } from "../../services/productService";
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTag, FaBuilding, FaGraduationCap, FaHeart, FaShare, FaChevronRight, FaChevronLeft, FaFlag } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import ShareModal from "@components/common/ShareModal/ShareModal";
import ReportModal from "@components/common/ReportModal/ReportModal";
import SEO from "@components/common/SEO/SEO";

import { useAuth } from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";
import { findOrCreateChat } from "../../services/chatService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../store/slices/wishlistSlice";

export default function ProductDetails() {
    const { id } = useParams();
    console.log('ProductDetails ID:', id);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
                console.log('Fetching product details for ID:', id);
                const data = await productService.getProductDetails(id);
                console.log('Fetched product data:', data);
                setProduct(data);
                // Reset image index when product changes
                setCurrentImageIndex(0);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleNextImage = (e) => {
        e.stopPropagation();
        if (uniqueImages.length <= 1) return;
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        if (uniqueImages.length <= 1) return;
        setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

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
    const activeImage = uniqueImages[currentImageIndex] || '/placeholder-image.jpg';

    // Animation variants
    const galleryVariants = {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const infoVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    return (
        <div className={styles.productPage}>
            <SEO
                title={product.title}
                description={product.description.substring(0, 150) + '...'}
                image={activeImage}
                url={`/product/${product.id}`}
                keywords={`${product.category_name}, ${product.university}, student marketplace, buy and sell`}
            />
            {/* Breadcrumb Navigation */}
            <motion.div
                className={styles.breadcrumbContainer}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.container}>
                    <nav className={styles.breadcrumb}>
                        <Link to="/">Home</Link>
                        <FaChevronRight className={styles.separator} size={10} />
                        <Link to="/marketplace">Marketplace</Link>
                        <FaChevronRight className={styles.separator} size={10} />
                        <span className={styles.currentPath}>{product.title}</span>
                    </nav>
                </div>
            </motion.div>

            <div className={styles.container}>
                <div className={styles.productGrid}>
                    {/* Left: Product Gallery */}
                    <motion.div
                        className={styles.gallerySection}
                        initial="hidden"
                        animate="visible"
                        variants={galleryVariants}
                    >
                        <div className={styles.mainImageWrapper}>
                            <img src={activeImage} alt={product.title} className={styles.mainImage} />

                            {/* Slider Controls */}
                            {uniqueImages.length > 1 && (
                                <>
                                    <button className={`${styles.sliderArrow} ${styles.arrowLeft}`} onClick={handlePrevImage}>
                                        <FaChevronLeft />
                                    </button>
                                    <button className={`${styles.sliderArrow} ${styles.arrowRight}`} onClick={handleNextImage}>
                                        <FaChevronRight />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div className={styles.sliderDots}>
                                        {uniqueImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`${styles.sliderDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentImageIndex(index);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Product Gallery Thumbnails */}
                        <div className={styles.thumbnailColumn}>
                            {uniqueImages.map((img, i) => (
                                <div
                                    key={i}
                                    className={`${styles.thumbnailWrapper} ${i === currentImageIndex ? styles.active : ''}`}
                                    onClick={() => setCurrentImageIndex(i)}
                                >
                                    <img src={img} alt={`${product.title} thumbnail ${i}`} className={styles.thumbnailImage} />
                                </div>
                            ))}
                        </div>


                        {/* Product Actions */}
                        <div className={styles.productActions}>
                            <button className={styles.contactBtn} onClick={handleContactSeller}>
                                Contact Seller
                            </button>
                            <button
                                className={`${styles.wishlistBtn} ${isInWishlist ? styles.wishlistActive : ''}`}
                                onClick={handleWishlistToggle}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <FaHeart />
                            </button>
                            <button
                                className={styles.shareBtn}
                                onClick={() => setShowShareModal(true)}
                                title="Share Product"
                            >
                                <FaShare />
                            </button>
                            <button
                                className={styles.shareBtn}
                                onClick={() => {
                                    if (!user) {
                                        openAuthModal();
                                        return;
                                    }
                                    setShowReportModal(true);
                                }}
                                title="Report Product"
                                style={{ color: 'var(--error)' }}
                            >
                                <FaFlag />
                            </button>
                        </div>

                        {/* Seller Information (Moved to Left) */}
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
                    </motion.div>

                    {/* Right: Product Details */}
                    <motion.div
                        className={styles.infoSection}
                        initial="hidden"
                        animate="visible"
                        variants={infoVariants}
                    >
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


                    </motion.div>
                </div>
            </div>



            {/* Share Modal */}
            <ShareModal
                show={showShareModal}
                onHide={() => setShowShareModal(false)}
                productUrl={window.location.href}
                productName={product.title}
            />
            <ReportModal
                show={showReportModal}
                onHide={() => setShowReportModal(false)}
                productId={product.id}
            />
        </div>
    );
}
