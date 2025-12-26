// components/ecommerce/FeaturedProducts/FeaturedProducts.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts({ title = "Featured Products", products = [] }) {
    const navigate = useNavigate();

    // Transform API products to match ProductCard expected format
    const transformedProducts = products.map(product => ({
        title: product.title || product.name,
        desc: product.description ? `${product.description.substring(0, 100)}...` : 'No description available',
        image: product.image,
        buttonText: "View Details",
        // Ensure seller property exists for navigation (ProductCard checks if product.seller exists)
        seller: product.seller || product.seller_id || true, // Add seller property for navigation
        // Add any other fields your ProductCard expects
        ...product
    }));

    const handleViewAllProducts = () => {
        navigate('/marketplace');
    };

    return (
        <section className={styles.featuredSection}>
            {/* Background elements moved to Home wrapper */}

            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.headerBadge}>
                        <span className={styles.badgeIcon}>⭐</span>
                        <span>Featured Collection</span>
                    </div>
                    <h2 className={styles.sectionTitle}>
                        {title}
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Discover our handpicked selection of premium products
                    </p>
                </div>

                <div className={styles.productsGrid}>
                    {transformedProducts.map((product, index) => (
                        <div key={product.id || index} className={styles.productCard}>

                            <div className={styles.cardImageContainer}>
                                <img
                                    src={product.image || '/placeholder-product.jpg'}
                                    alt={product.title || product.name}
                                    className={styles.cardImage}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                    }}
                                />
                                <div className={styles.imageOverlay}>
                                    <div className={styles.overlayContent}>
                                        <button className={styles.quickViewBtn}>
                                            Quick View
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.productMeta}>
                                    <span className={styles.productCategory}>
                                        {product.category_name || 'Product'}
                                    </span>
                                    <span className={styles.productPrice}>
                                        {product.price || 'N/A'} EGP
                                    </span>
                                </div>

                                <h3 className={styles.productTitle}>
                                    {product.title || product.name}
                                </h3>

                                <p className={styles.productDescription}>
                                    {product.desc}
                                </p>

                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.viewDetailsBtn}
                                        onClick={() => navigate(`/product/${product.id || product._id}`)}
                                    >
                                        View Details
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.cardGlow}></div>
                        </div>
                    ))}
                </div>

                <div className={styles.sectionFooter}>
                    <div className={styles.viewAllContainer}>
                        <button className={styles.viewAllBtn} onClick={handleViewAllProducts}>
                            <span>View All Products</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
