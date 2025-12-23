import React, { useState, useEffect } from "react";
import { Button, Spinner, Container } from "react-bootstrap";
import { FaPlusCircle, FaEdit, FaTrash, FaBox, FaEye, FaChartLine, FaStar, FaCalendarAlt } from "react-icons/fa";
import styles from "./MyAds.module.css";
import ProductForm from "../../components/common/forms/ProductForm/ProductForm";
import { useProduct } from "../../hooks/useProducts";

export default function MyAds() {
    const { myProducts: reduxMyProducts, loading, error, getMyProducts, removeProduct } = useProduct();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [myProducts, setMyProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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

    const handleAdd = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteClick = (product) => {
        console.log('Delete button clicked for product:', product.id);
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            console.log('User confirmed deletion, calling removeProduct...');
            const success = await removeProduct(productToDelete.id);
            console.log('Delete result:', success);
            if (success) {
                console.log('Product deleted successfully, refreshing products...');
                fetchProducts();
            } else {
                console.log('Product deletion failed');
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

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <FaChartLine />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>0</span>
                                <span className={styles.statLabel}>Views This Month</span>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <FaStar />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>4.8</span>
                                <span className={styles.statLabel}>Average Rating</span>
                            </div>
                        </div>
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
                                myProducts.map((product) => (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.productInfo}>
                                                <h3 className={styles.productTitle}>{product.title}</h3>
                                                <span className={styles.productCategory}>
                                                    {product.category_name || 'Uncategorized'}
                                                </span>
                                            </div>
                                            <div className={styles.productStatus}>
                                                <span className={`${styles.statusBadge} ${product.is_active ? styles.statusActive : styles.statusDraft}`}>
                                                    {product.is_active ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardContent}>
                                            <div className={styles.productDetails}>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Price:</span>
                                                    <span className={styles.detailValue}>${product.price}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Views:</span>
                                                    <span className={styles.detailValue}>0</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Listed:</span>
                                                    <span className={styles.detailValue}>
                                                        {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.editButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Edit button clicked for product:', product);
                                                    handleEdit(product);
                                                }}
                                            >
                                                <FaEdit />
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => {
                                                    console.log('Delete button clicked for product:', product.id);
                                                    handleDeleteClick(product);
                                                }}
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>

                                        <div className={styles.cardGlow}></div>
                                    </div>
                                ))
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
                            console.log('Modal overlay clicked, closing modal');
                            handleFormClose();
                        }
                    }}
                >
                    <div
                        className={styles.modal}
                        style={{ position: 'relative', zIndex: 10000 }}
                    >
                        {console.log('Rendering ProductForm with product:', editingProduct)}
                        <ProductForm
                            product={editingProduct}
                            onClose={() => {
                                console.log('Form close requested');
                                handleFormClose();
                            }}
                            onSuccess={() => {
                                console.log('Form success triggered');
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
        </div>
    );
}
