import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { Container, Row, Col, Button, ProgressBar, Badge } from "react-bootstrap";
import { BsStarFill, BsStarHalf, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope, FaTag, FaBuilding, FaGraduationCap, FaHeart, FaShare } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";

import { useAuth } from "../../hooks/useAuth";
import { findOrCreateChat } from "../../services/chatService";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleContactSeller = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const chat = await findOrCreateChat(product.id, product.seller.id, user.id);
            if (chat && chat.id) {
                navigate(`/chat/${chat.id}`);
            }
        } catch (error) {
            console.error("Error contacting seller:", error);
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

    const reviewBars = [
        { rate: 5, percent: 72 },
        { rate: 4, percent: 18 },
        { rate: 3, percent: 5 },
        { rate: 2, percent: 3 },
        { rate: 1, percent: 2 },
    ];

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
                        <span>{product.category_name}</span>
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
                        <Col xs={6} className={styles.imageColumn}>
                            <div className={styles.imageGallery}>
                                <div
                                    className={styles.mainProductImage}
                                    style={{
                                        backgroundImage: `url(${product.image || product.images?.[0] || '/placeholder-image.jpg'})`
                                    }}
                                >
                                    <div className={styles.imageOverlay}>
                                        <button className={styles.imageActionBtn}>
                                            <FaHeart />
                                        </button>
                                        <button className={styles.imageActionBtn}>
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
                        <Col xs={6} className={styles.detailsColumn}>
                            <div className={styles.productHeader}>
                                <div className={styles.categoryBadge}>
                                    <FaTag />
                                    {product.category_name}
                                </div>
                                <h1 className={styles.productTitle}>{product.title}</h1>
                                <div className={styles.productMeta}>
                                    <div className={styles.rating}>
                                        <div className={styles.stars}>
                                            {ratingStars}
                                        </div>
                                        <span className={styles.ratingText}>
                                            {product.rating || 4.5} ({product.reviewsCount || 128} reviews)
                                        </span>
                                    </div>
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
                                    <div className={styles.price}>${product.price}</div>
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
                                    <span>{product.seller?.phone || 'Contact for details'}</span>
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

                            <div className={styles.sellerStats}>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>4.8</span>
                                    <span className={styles.statLabel}>Seller Rating</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>24</span>
                                    <span className={styles.statLabel}>Items Sold</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>98%</span>
                                    <span className={styles.statLabel}>Response Rate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Reviews Section */}
            <section className={styles.reviewsSection}>
                <Container>
                    <div className={styles.reviewsCard}>
                        <div className={styles.reviewsHeader}>
                            <h3>Customer Reviews & Ratings</h3>
                            <div className={styles.overallRating}>
                                <div className={styles.ratingScore}>
                                    <span className={styles.scoreNumber}>{product.rating || 4.5}</span>
                                    <div className={styles.scoreStars}>
                                        {ratingStars}
                                    </div>
                                </div>
                                <div className={styles.ratingSummary}>
                                    <span className={styles.reviewCount}>
                                        Based on {product.reviewsCount || 128} reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ratingBreakdown}>
                            {reviewBars.map((bar) => (
                                <div className={styles.ratingBar} key={bar.rate}>
                                    <div className={styles.barLabel}>
                                        <span>{bar.rate} stars</span>
                                    </div>
                                    <div className={styles.barContainer}>
                                        <ProgressBar now={bar.percent} className={styles.progressBar} />
                                    </div>
                                    <div className={styles.barPercent}>
                                        <span>{bar.percent}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
