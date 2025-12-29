import React, { useState, useEffect } from "react";
import { Button, Spinner, Container } from "react-bootstrap";
import { FaPlusCircle, FaEdit, FaTrash, FaBox, FaEye, FaChartLine, FaStar, FaCalendarAlt, FaRedo, FaClock } from "react-icons/fa";
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

    const fetchProducts = async () => {
        await getMyProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Update local state when Redux state changes
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
            console.error('Error checking eligibility:', error);
            // If error, allow them to try adding (backend will validate)
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
            {/* Hero Section */}
            <section className={styles.dashboardHero}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroGlow1}></div>
                    <div className={styles.heroGlow2}></div>
                    <div className={styles.heroGlow3}></div>
                </div>

                <Container className={styles.heroContent}>
                    <div className={styles.heroHeader}>
                        <FaBox className={styles.heroIcon} />
                        <h1 className={styles.heroTitle}>My Dashboard</h1>
                        <p className={styles.heroSubtitle}>Manage your products and track your performance</p>
                    </div>

                    <div className={styles.heroActions}>
                        <button className={styles.primaryButton} onClick={handleAdd}>
                            <FaPlusCircle />
                            Add New Product
                        </button>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <Container>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <FaBox />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>{myProducts.length}</span>
                                <span className={styles.statLabel}>Total Products</span>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <FaEye />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>
                                    {myProducts.filter(p => p.is_active).length}
                                </span>
                                <span className={styles.statLabel}>Active Listings</span>
                            </div>
                        </div>

                        {/* Rating Removed */}
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className={styles.dashboardContent}>
                <Container>
                    <div className={styles.contentHeader}>
                        <h2 className={styles.sectionTitle}>My Products</h2>
                        <div className={styles.contentActions}>
                            <button className={styles.secondaryButton} onClick={fetchProducts}>
                                <FaCalendarAlt />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Loading your products...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.errorState}>
                            <div className={styles.errorAlert}>
                                <h4>Oops! Something went wrong</h4>
                                <p>{error}</p>
                                <button className={styles.retryButton} onClick={fetchProducts}>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.productsGrid}>
                            {myProducts.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        <FaBox />
                                    </div>
                                    <h3 className={styles.emptyTitle}>No products yet</h3>
                                    <p className={styles.emptyDescription}>
                                        Start building your marketplace presence by listing your first product.
                                    </p>
                                    <button className={styles.primaryButton} onClick={handleAdd}>
                                        <FaPlusCircle />
                                        Add Your First Product
                                    </button>
                                </div>
                            ) : (
                                myProducts.map((product) => {
                                    const isExpired = product.is_expired || product.status === 'expired';

                                    return (
                                        <div key={product.id} className={`${styles.productCard} ${isExpired ? styles.expiredCard : ''}`}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.productInfo}>
                                                    <h3 className={styles.productTitle}>{product.title}</h3>
                                                    <span className={styles.productCategory}>
                                                        {product.category_name || 'Uncategorized'}
                                                    </span>
                                                </div>
                                                <div className={styles.productStatus}>
                                                    {isExpired ? (
                                                        <span className={`${styles.statusBadge} ${styles.statusExpired}`}>
                                                            Expired
                                                        </span>
                                                    ) : product.is_active ? (
                                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.cardContent}>
                                                <div className={styles.productDetails}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Price:</span>
                                                        <span className={styles.detailValue}>{product.price} EGP</span>
                                                    </div>
                                                    {product.is_active && product.days_remaining !== null && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>
                                                                <FaClock className={styles.clockIcon} /> Expires in:
                                                            </span>
                                                            <span className={`${styles.detailValue} ${product.days_remaining <= 5 ? styles.expiringWarn : ''}`}>
                                                                {product.days_remaining} days
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Listed:</span>
                                                        <span className={styles.detailValue}>
                                                            {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.cardActions}>
                                                {isExpired ? (
                                                    <>
                                                        <button
                                                            className={styles.republishButton}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRepublish(product);
                                                            }}
                                                        >
                                                            <FaRedo />
                                                            Republish
                                                        </button>
                                                        <button
                                                            className={styles.deleteButton}
                                                            onClick={() => {
                                                                handleDeleteClick(product);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className={styles.editButton}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(product);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                            Edit
                                                        </button>
                                                        <button
                                                            className={styles.deleteButton}
                                                            onClick={() => {
                                                                handleDeleteClick(product);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            <div className={styles.cardGlow}></div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </Container>
            </section>

            {/* Product Form Modal */}
            {showForm && (
                <div
                    className={styles.modalOverlay}
                    style={{ zIndex: 9999 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleFormClose();
                        }
                    }}
                >
                    <div
                        className={styles.modal}
                        style={{ position: 'relative', zIndex: 10000 }}
                    >
                        <ProductForm
                            product={editingProduct}
                            isRepublishing={isRepublishing}
                            onClose={() => {
                                handleFormClose();
                            }}
                            onSuccess={() => {
                                handleFormSuccess();
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <div
                    className={styles.modalOverlay}
                    onClick={handleDeleteCancel}
                >
                    <div className={styles.deleteModal}>
                        <div className={styles.deleteModalHeader}>
                            <FaTrash className={styles.deleteIcon} />
                            <h3 className={styles.deleteModalTitle}>Delete Product</h3>
                        </div>
                        <div className={styles.deleteModalBody}>
                            <p className={styles.deleteModalMessage}>
                                Are you sure you want to delete <strong>"{productToDelete.title}"</strong>?
                            </p>
                            <p className={styles.deleteModalWarning}>
                                This action cannot be undone. The product will be permanently removed from your listings.
                            </p>
                        </div>
                        <div className={styles.deleteModalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleDeleteConfirm}
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription Required Modal */}
            <SubscriptionRequiredModal
                show={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                daysUntilReset={daysUntilReset}
            />
        </div>
    );
}
