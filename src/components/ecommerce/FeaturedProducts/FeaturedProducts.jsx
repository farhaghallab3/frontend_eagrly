// components/ecommerce/FeaturedProducts/FeaturedProducts.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./FeaturedProducts.module.css";

// React Bits Components
import { SplitText, SpotlightCard, TiltCard } from '@components/common/reactbits';

// Inline SVG placeholder for broken/missing product images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%231a1a1a' width='300' height='300'/%3E%3Cpath d='M150 90c-33.1 0-60 26.9-60 60s26.9 60 60 60 60-26.9 60-60-26.9-60-60-60zm0 100c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z' fill='%23333'/%3E%3Cpath d='M150 110c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 60c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%23444'/%3E%3Ctext x='150' y='220' text-anchor='middle' fill='%23666' font-family='Arial' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function FeaturedProducts({ products = [] }) {
    const navigate = useNavigate();

    // Transform API products to match ProductCard expected format
    const transformedProducts = products.slice(0, 4).map(product => ({
        title: product.title || product.name,
        desc: product.description ? `${product.description.substring(0, 100)}...` : 'No description available',
        image: product.image,
        buttonText: "View Details",
        seller: product.seller || product.seller_id || true,
        ...product
    }));

    const handleViewAllProducts = () => {
        navigate('/marketplace');
    };

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    return (
        <section className={styles.featuredSection}>
            <div className={styles.sectionContainer}>
                <motion.div
                    className={styles.sectionHeader}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={headerVariants}
                >
                    <div className={styles.headerBadge}>
                        <span>Featured Collection</span>
                    </div>

                    {/* SplitText Animation for Section Title */}
                    <SplitText
                        text="Featured Products"
                        className={styles.sectionTitle}
                        delay={40}
                        splitBy="letter"
                        animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    />

                    <p className={styles.sectionSubtitle}>
                        Discover our handpicked selection of premium products for your needs.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.productsGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    {transformedProducts.map((product, index) => (
                        <motion.div key={product.id || index} variants={cardVariants}>
                            <div className={styles.productCard}>
                                <div
                                    className={styles.cardImageContainer}
                                    onClick={() => navigate(`/product/${product.id || product._id}`)}
                                >
                                    <img
                                        src={product.image || PLACEHOLDER_IMAGE}
                                        alt={product.title || product.name}
                                        className={styles.cardImage}
                                        onError={(e) => {
                                            e.target.src = PLACEHOLDER_IMAGE;
                                        }}
                                    />
                                </div>

                                <div className={styles.cardContent}>
                                    <h3
                                        className={styles.productTitle}
                                        onClick={() => navigate(`/product/${product.id || product._id}`)}
                                    >
                                        {product.title || product.name}
                                    </h3>

                                    <div className={styles.priceRow}>
                                        <span className={styles.productPrice}>
                                            {product.price || 'N/A'} EGP
                                        </span>
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.addToCartBtn}
                                            onClick={() => navigate(`/product/${product.id || product._id}`)}
                                        >
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className={styles.sectionFooter}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <button className={styles.viewAllBtn} onClick={handleViewAllProducts}>
                        <span>View All Products</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
