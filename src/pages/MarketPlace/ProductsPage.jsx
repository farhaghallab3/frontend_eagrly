import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import ProductFilters from '@components/ecommerce/ProductFilters/ProductFilters';
import ProductsGrid from '@components/ecommerce/ProductsGrid/ProductsGrid';
import { productService } from '../../services/productService.js';
import { useCategories } from '../../hooks/useCategories.js';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { categories } = useCategories();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: categoryFromUrl || "",
    university: "",
    faculty: "",
    priceRange: [0, 5000],
    inStock: false,
    features: []
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (categoryFromUrl) {
        data = await productService.getProductsByCategory(categoryFromUrl);
      } else {
        data = await productService.getAll();
      }
      setProducts(data);
    } catch (err) {
      setError(`Failed to fetch products: ${err.message}`);
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [categoryFromUrl]);

  // Featured products
  const featuredProducts = Array.isArray(products)
    ? products.filter(p => p.is_featured).slice(0, 6)
    : [];

  // Filter products safely
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (!product) return false;

    const prodCategory = String(product.category?.name || product.category || '').trim();
    const prodUniversity = String(product.university || '').trim();
    const prodFaculty = String(product.faculty || '').trim();
    const prodPrice = Number(product.price || 0);
    const prodStatus = String(product.status || '').trim();

    if (filters.category && prodCategory !== String(filters.category || '').trim()) return false;
    if (filters.university && prodUniversity !== String(filters.university || '').trim()) return false;
    if (filters.faculty && prodFaculty !== String(filters.faculty || '').trim()) return false;
    if (prodPrice < filters.priceRange[0] || prodPrice > filters.priceRange[1]) return false;
    if (filters.inStock && prodStatus.toLowerCase() !== 'available') return false;

    return true;
  }) : [];

  const clearAllFilters = () => setFilters({
    category: "",
    university: "",
    faculty: "",
    priceRange: [0, 5000],
    inStock: false,
    features: []
  });

  return (
    <div className={styles.marketplacePage}>
      {/* Hero Section */}
      <section className={styles.marketplaceHero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGlow1}></div>
          <div className={styles.heroGlow2}></div>
          <div className={styles.heroGlow3}></div>
        </div>

        <Container className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>🛍️</span>
            <span>Marketplace</span>
          </div>

          <h1 className={styles.heroTitle}>
            Discover Amazing Products
          </h1>

          <p className={styles.heroSubtitle}>
            Explore our curated collection of high-quality products from trusted sellers.
            Find exactly what you need with our advanced filtering and search features.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Array.isArray(products) ? products.length : 0}+
              </span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Array.isArray(categories) ? categories.length : 0}+
              </span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4.8</span>
              <span className={styles.statLabel}>Avg Rating</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className={styles.marketplaceContent}>
        <Container>
          <div className={styles.contentGrid}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  products={products}
                  onClearFilters={clearAllFilters}
                  categories={categories}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading amazing products...</p>
                </div>
              )}

              {error && (
                <div className={styles.errorState}>
                  <div className={styles.errorAlert}>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button
                      className={styles.retryButton}
                      onClick={fetchProducts}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <>
                  {/* Results Summary */}
                  <div className={styles.resultsSummary}>
                    <div className={styles.resultsText}>
                      Showing {filteredProducts.length} of {products.length} products
                      {filters.category && ` in ${filters.category}`}
                    </div>
                    <div className={styles.resultsCount}>
                      {filteredProducts.length} Results
                    </div>
                  </div>

                  {/* Featured Products */}
                  {featuredProducts.length > 0 && (
                    <div style={{ marginBottom: '60px' }}>
                      <FeaturedProducts
                        title="⭐ Featured Products"
                        products={featuredProducts}
                      />
                    </div>
                  )}

                  {/* Products Grid */}
                  <ProductsGrid
                    products={filteredProducts}
                    allProductsCount={products.length}
                    filters={filters}
                    onFilterChange={setFilters}
                  />
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ProductsPage;
