// components/ecommerce/FeaturedProducts/FeaturedProducts.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdShoppingBag, MdFavoriteBorder } from "react-icons/md";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts({ products = [] }) {
    const navigate = useNavigate();

    // Transform API products to match ProductCard expected format
    const transformedProducts = products.slice(0, 4).map(product => ({
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
            {/* Background elements moved to Home wrapper */}

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
                    <h2 className={styles.sectionTitle}>
                        Featured Products
                    </h2>
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
                                <div className={styles.cardImageContainer} onClick={() => navigate(`/product/${product.id || product._id}`)}>
                                    <img
                                        src={product.image || '/placeholder-product.jpg'}
                                        alt={product.title || product.name}
                                        className={styles.cardImage}
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.jpg';
                                        }}
                                    />
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.productTitle} onClick={() => navigate(`/product/${product.id || product._id}`)}>
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
