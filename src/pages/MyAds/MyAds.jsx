import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaBox, FaEye, FaCalendarAlt, FaRedo, FaClock, FaExclamationTriangle } from "react-icons/fa";
import styles from "./MyAds.module.css";
import ProductForm from "../../components/common/forms/ProductForm/ProductForm";
import { useProduct } from "../../hooks/useProducts";
import { productService } from "../../services/productService";
import SubscriptionRequiredModal from "../../components/ecommerce/SubscriptionPlans/SubscriptionRequiredModal";

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

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const fetchProducts = async () => {
        await getMyProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
        fetchProducts();
    };

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.container}>
                {/* Hero Section */}
                <section className={styles.dashboardHero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroHeader}>
                            <FaBox className={styles.heroIcon} />
                            <h1 className={styles.heroTitle}>Dashboard</h1>
                            <p className={styles.heroSubtitle}>Manage your products and track your performance</p>
                        </div>
                        <div className={styles.heroActions}>
                            <button className={styles.primaryButton} onClick={handleAdd}>
                                <FaPlusCircle />
                                <span>List New Product</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className={styles.statsSection}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><FaBox /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>{myProducts.length}</span>
                                <span className={styles.statLabel}>Total Products</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><FaEye /></div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>
                                    {myProducts.filter(p => p.status === 'active').length}
                                </span>
                                <span className={styles.statLabel}>Active Listings</span>
                            </div>
                        </div>
                    </div>
                </section>

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
                        <div className={styles.productsGrid}>
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
                                    // Calculate days remaining manually if backend doesn't provide it
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
                                        <div key={product.id} className={styles.productCard}>
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
                                                    {product.status === 'active' && product.expires_at && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>Expiry Date</span>
                                                            <div className={styles.expiryDetail}>
                                                                <span className={`${styles.detailValue} ${daysRemaining <= 5 ? styles.expiringWarn : ''}`}>
                                                                    {formatDate(product.expires_at)}
                                                                </span>
                                                                <span className={`${styles.daysLeftBadge} ${daysRemaining <= 5 ? styles.daysLeftUrgent : ''}`}>
                                                                    {daysRemaining}d left
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
                                        </div>
                                    );
                                })
                            )}
                        </div>
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
        </div>
    );
}
