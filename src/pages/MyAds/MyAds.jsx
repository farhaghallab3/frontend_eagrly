import React, { useState, useEffect, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlusCircle, FaEdit, FaTrash, FaBox, FaEye, FaCalendarAlt, FaRedo, FaClock, FaExclamationTriangle } from "react-icons/fa";
import styles from "./MyAds.module.css";
import ProductForm from "../../components/common/forms/ProductForm/ProductForm";
import { useProduct } from "../../hooks/useProducts";
import { productService } from "../../services/productService";
import SubscriptionRequiredModal from "../../components/ecommerce/SubscriptionPlans/SubscriptionRequiredModal";
import SuccessAnimation from "../../components/common/feedback/SuccessAnimation";

export default function MyAds() {
    const { myProducts: reduxMyProducts, loading, error, getMyProducts, removeProduct } = useProduct();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [myProducts, setMyProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [daysUntilReset, setDaysUntilReset] = useState(30);
    const [isRepublishing, setIsRepublishing] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const fetchProducts = useCallback(async () => {
        await getMyProducts();
    }, [getMyProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setMyProducts(reduxMyProducts || []);
    }, [reduxMyProducts]);

    const handleAdd = async () => {
        try {
            const eligibility = await productService.checkEligibility();
            if (eligibility.can_post) {
                setEditingProduct(null);
                setIsRepublishing(false);
                setShowForm(true);
            } else {
                setDaysUntilReset(eligibility.days_until_reset || 30);
                setShowSubscriptionModal(true);
            }
        } catch (error) {
            console.error('Eligibility check failed:', error);
            setEditingProduct(null);
            setIsRepublishing(false);
            setShowForm(true);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsRepublishing(false);
        setShowForm(true);
    };

    const handleRepublish = (product) => {
        setEditingProduct(product);
        setIsRepublishing(true);
        setShowForm(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            const success = await removeProduct(productToDelete.id);
            if (success) {
                fetchProducts();
            }
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const handleFormClose = () => setShowForm(false);

    const handleFormSuccess = () => {
        setShowForm(false);
        // Trigger Success Animation
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
        fetchProducts();
    };

    // Animation variants
    const heroVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const statsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const productContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 }
        }
    };

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.container}>
                {/* Hero Section */}
                <motion.section
                    className={styles.dashboardHero}
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                >
                    <div className={styles.heroContent}>
                        <div className={styles.heroHeader}>
                            <FaBox className={styles.heroIcon} />
                            <h1 className={styles.heroTitle}>Dashboard</h1>
                            <p className={styles.heroSubtitle}>Manage your products and track your performance</p>
                        </div>
                        <div className={styles.heroActions}>
                            <motion.button
                                className={styles.primaryButton}
                                onClick={handleAdd}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FaPlusCircle />
                                <span>List New Product</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* Stats Section */}
                <motion.section
                    className={styles.statsSection}
                    initial="hidden"
                    animate="visible"
                    variants={statsVariants}
                >
                    <div className={styles.statsGrid}>
                        <motion.div className={styles.statCard} variants={cardVariants}>
                            <div className={styles.statIcon}><FaBox /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>{myProducts.length}</span>
                                <span className={styles.statLabel}>Total Products</span>
                            </div>
                        </motion.div>
                        <motion.div className={styles.statCard} variants={cardVariants}>
                            <div className={styles.statIcon}><FaEye /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>
                                    {myProducts.filter(p => p.status === 'active').length}
                                </span>
                                <span className={styles.statLabel}>Active Listings</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Main Content */}
                <section className={styles.dashboardContent}>
                    <div className={styles.contentHeader}>
                        <h2 className={styles.sectionTitle}>Your Listings</h2>
                        <div className={styles.contentActions}>
                            <button className={styles.secondaryButton} onClick={fetchProducts}>
                                <FaCalendarAlt />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {showSuccessAnimation && (
                        <SuccessAnimation
                            message={
                                editingProduct
                                    ? (isRepublishing ? "Ad Republished!" : "Ad Updated Successfully!")
                                    : "Ad Posted Successfully!"
                            }
                        />
                    )}

                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Updating your inventory...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.errorState}>
                            <p>{error}</p>
                            <button className={styles.primaryButton} onClick={fetchProducts}>Retry</button>
                        </div>
                    ) : (
                        <motion.div
                            className={styles.productsGrid}
                            initial="hidden"
                            animate="visible"
                            variants={productContainerVariants}
                        >
                            {myProducts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <FaBox className={styles.emptyIcon} />
                                    <h3 className={styles.emptyTitle}>Nothing here yet</h3>
                                    <p className={styles.emptyDescription}>
                                        Ready to start selling? List your first product now.
                                    </p>
                                    <button className={styles.primaryButton} onClick={handleAdd}>
                                        <FaPlusCircle />
                                        <span>Add Product</span>
                                    </button>
                                </div>
                            ) : (
                                myProducts.map((product) => {
                                    let daysRemaining = product.days_remaining;
                                    if (daysRemaining === undefined && product.expires_at) {
                                        const expiry = new Date(product.expires_at);
                                        const now = new Date();
                                        const diffTime = expiry - now;
                                        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                                    }

                                    const isExpired = product.status === 'expired' ||
                                        (product.expires_at && new Date(product.expires_at) < new Date());
                                    return (
                                        <motion.div key={product.id} className={styles.productCard} variants={cardVariants}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.productInfo}>
                                                    <h3 className={styles.productTitle}>{product.title}</h3>
                                                    <span className={styles.productCategory}>
                                                        {product.category_name || 'Marketplace'}
                                                    </span>
                                                </div>
                                                <div className={styles.productStatus}>
                                                    {isExpired ? (
                                                        <span className={`${styles.statusBadge} ${styles.statusExpired}`}>Expired</span>
                                                    ) : product.is_active ? (
                                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span>
                                                    ) : (
                                                        <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.cardContent}>
                                                <div className={styles.productDetails}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Price</span>
                                                        <span className={styles.detailValue}>{product.price} EGP</span>
                                                    </div>
                                                    {product.is_active && product.expires_at && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Expiry Date</span>
                                                            <div className={styles.expiryDetail}>
                                                                <span className={`${styles.detailValue} ${daysRemaining <= 5 ? styles.expiringWarn : ''}`}>
                                                                    {formatDate(product.expires_at)}
                                                                </span>
                                                                <span className={`${styles.daysLeftBadge} ${daysRemaining <= 5 ? styles.daysLeftUrgent : ''}`}>
                                                                    {daysRemaining} Days Left
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.cardActions}>
                                                {isExpired ? (
                                                    <button className={styles.republishButton} onClick={() => handleRepublish(product)}>
                                                        <FaRedo /> Republish
                                                    </button>
                                                ) : (
                                                    <button className={styles.editButton} onClick={() => handleEdit(product)}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                )}
                                                <button className={styles.deleteButton} onClick={() => handleDeleteClick(product)}>
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </motion.div>
                    )}
                </section>

                {/* Form Modal */}
                {showForm && (
                    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && handleFormClose()}>
                        <div className={styles.modal}>
                            <ProductForm
                                product={editingProduct}
                                isRepublishing={isRepublishing}
                                onClose={handleFormClose}
                                onSuccess={handleFormSuccess}
                            />
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && productToDelete && (
                    <div className={styles.modalOverlay} onClick={handleDeleteCancel}>
                        <div className={styles.deleteModal} onClick={e => e.stopPropagation()}>
                            <h3 className={styles.deleteModalTitle}>Delete Product?</h3>
                            <p className={styles.deleteModalMessage}>
                                Removing <strong>"{productToDelete.title}"</strong> is permanent.
                            </p>
                            <p className={styles.deleteModalWarning}>This action cannot be undone.</p>
                            <div className={styles.deleteModalActions}>
                                <button className={styles.cancelButton} onClick={handleDeleteCancel}>Keep</button>
                                <button className={styles.confirmDeleteButton} onClick={handleDeleteConfirm}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                <SubscriptionRequiredModal
                    show={showSubscriptionModal}
                    onClose={() => setShowSubscriptionModal(false)}
                    daysUntilReset={daysUntilReset}
                />
            </div>
        </div >
    );
}
