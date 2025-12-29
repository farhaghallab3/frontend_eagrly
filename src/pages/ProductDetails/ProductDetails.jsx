import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { Container, Row, Col, Button, ProgressBar, Badge } from "react-bootstrap";
import { BsStarFill, BsStarHalf, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope, FaTag, FaBuilding, FaGraduationCap, FaHeart, FaShare } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";
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
            // Check if error has a message from backend
            const msg = error.response?.data?.error || "Failed to start chat with seller.";
            toast.error(msg);
        }
    };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductDetails(id);
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-white">Loading...</p>;
    if (!product) return <p className="text-white">Product not found.</p>;

    // Ratings stars
    const ratingStars = [];
    const fullStars = Math.floor(product.rating || 4);
    const halfStar = product.rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) ratingStars.push(<BsStarFill key={i} className={styles.star} />);
    if (halfStar) ratingStars.push(<BsStarHalf key="half" className={styles.star} />);

    // const reviewBars = [
    //     { rate: 5, percent: 72 },
    //     { rate: 4, percent: 18 },
    //     { rate: 3, percent: 5 },
    //     { rate: 2, percent: 3 },
    //     { rate: 1, percent: 2 },
    // ];

    return (
        <div className={styles.productPage}>
            {/* Breadcrumb Navigation */}
            <Container className={styles.breadcrumbContainer}>
                <nav className={styles.breadcrumb}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <BsArrowLeft />
                        Back to Marketplace
                    </button>
                    <div className={styles.breadcrumbPath}>
                        <span>Marketplace</span>
                        <BsArrowRight className={styles.breadcrumbSeparator} />
                        <span>{product.category_name || 'Category'}</span>
                        <BsArrowRight className={styles.breadcrumbSeparator} />
                        <span className={styles.breadcrumbCurrent}>{product.title}</span>
                    </div>
                </nav>
            </Container>

            {/* Main Product Section */}
            <section className={styles.productSection}>
                <Container>
                    <Row className={styles.productRow}>
                        {/* Left: Product Images */}
                        <Col xs={12} md={6} className={styles.imageColumn}>
                            <div className={styles.imageGallery}>
                                <div
                                    className={styles.mainProductImage}
                                    style={{
                                        backgroundImage: `url(${product.image || product.images?.[0] || '/placeholder-image.jpg'})`
                                    }}
                                >
                                    <div className={styles.imageOverlay}>
                                        <button
                                            className={`${styles.imageActionBtn} ${isInWishlist ? styles.wishlistActive : ''}`}
                                            onClick={handleWishlistToggle}
                                            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                        >
                                            <FaHeart />
                                        </button>
                                        <button
                                            className={styles.imageActionBtn}
                                            onClick={() => setShowShareModal(true)}
                                            title="Share product"
                                        >
                                            <FaShare />
                                        </button>
                                    </div>
                                </div>

                                {product.images && product.images.length > 1 && (
                                    <div className={styles.thumbnailGrid}>
                                        {product.images.slice(0, 4).map((img, i) => (
                                            <div
                                                key={i}
                                                className={styles.productThumbnail}
                                                style={{ backgroundImage: `url(${img})` }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Right: Product Details */}
                        <Col xs={12} md={6} className={styles.detailsColumn}>
                            <div className={styles.productHeader}>
                                <div className={styles.categoryBadge}>
                                    <FaTag />
                                    {product.category_name}
                                </div>
                                <h1 className={styles.productTitle}>{product.title}</h1>
                                <div className={styles.productMeta}>
                                    {/* Rating Removed */}
                                </div>
                            </div>

                            <div className={styles.productDescription}>
                                <h3>Product Description</h3>
                                <p>{product.description}</p>
                            </div>

                            <div className={styles.productSpecs}>
                                <h3>Product Details</h3>
                                <div className={styles.specsGrid}>
                                    <div className={styles.specItem}>
                                        <FaTag className={styles.specIcon} />
                                        <div>
                                            <span className={styles.specLabel}>Condition</span>
                                            <span className={styles.specValue}>{product.condition || 'Used'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.specItem}>
                                        <FaGraduationCap className={styles.specIcon} />
                                        <div>
                                            <span className={styles.specLabel}>University</span>
                                            <span className={styles.specValue}>{product.university || 'Not specified'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.specItem}>
                                        <FaBuilding className={styles.specIcon} />
                                        <div>
                                            <span className={styles.specLabel}>Faculty</span>
                                            <span className={styles.specValue}>{product.faculty || 'Not specified'}</span>
                                        </div>
                                    </div>

                                    <div className={styles.specItem}>
                                        <FaCalendarAlt className={styles.specIcon} />
                                        <div>
                                            <span className={styles.specLabel}>Listed</span>
                                            <span className={styles.specValue}>
                                                {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.productActions}>
                                <div className={styles.priceSection}>
                                    <div className={styles.price}>{product.price} EGP</div>
                                    <div className={styles.priceSubtext}>Best offer available</div>
                                </div>

                                <div className={styles.actionButtons}>
                                    <ButtonPrimary
                                        text="Contact Seller"
                                        onClick={handleContactSeller}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Seller Information Section */}
            <section className={styles.sellerSection}>
                <Container>
                    <div className={styles.sellerCard}>
                        <div className={styles.sellerHeader}>
                            <FaUser className={styles.sellerIcon} />
                            <h3>Seller Information</h3>
                        </div>

                        <div className={styles.sellerInfo}>
                            <div className={styles.sellerDetails}>
                                <div className={styles.sellerItem}>
                                    <FaUser className={styles.detailIcon} />
                                    <span>{product.seller?.first_name || 'Seller Name'}</span>
                                </div>

                                <div className={styles.sellerItem}>
                                    <FaPhone className={styles.detailIcon} />
                                    <span>{product.seller?.phone || 'Phone not provided'}</span>
                                </div>

                                <div className={styles.sellerItem}>
                                    <FaEnvelope className={styles.detailIcon} />
                                    <span>{product.seller?.email || 'Contact for details'}</span>
                                </div>

                                <div className={styles.sellerItem}>
                                    <FaMapMarkerAlt className={styles.detailIcon} />
                                    <span>{product.university || 'Location not specified'}</span>
                                </div>
                            </div>

                            {/* Seller Stats Removed */}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Section Removed */}
            {/* Share Modal */}
            {product && (
                <ShareModal
                    show={showShareModal}
                    onHide={() => setShowShareModal(false)}
                    productUrl={window.location.href}
                    productName={product.title}
                />
            )}
        </div>
    );
}
