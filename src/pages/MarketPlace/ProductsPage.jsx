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
    governorate: "",
    priceRange: [0, 100000],
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

    const prodCategory = String(product.category_name || product.category?.name || product.category || '').trim();
    const prodUniversity = String(product.university || '').trim();
    const prodFaculty = String(product.faculty || '').trim();
    const prodGovernorate = String(product.governorate || '').trim();
    const prodPrice = Number(product.price || 0);
    const prodStatus = String(product.status || '').trim();

    if (filters.category && prodCategory.toLowerCase() !== String(filters.category || '').trim().toLowerCase()) return false;
    if (filters.university && prodUniversity.toLowerCase() !== String(filters.university || '').trim().toLowerCase()) return false;
    if (filters.faculty && prodFaculty.toLowerCase() !== String(filters.faculty || '').trim().toLowerCase()) return false;
    if (filters.governorate && prodGovernorate.toLowerCase() !== String(filters.governorate || '').trim().toLowerCase()) return false;
    if (prodPrice < filters.priceRange[0] || prodPrice > filters.priceRange[1]) return false;
    if (filters.inStock && prodStatus.toLowerCase() !== 'active' && prodStatus.toLowerCase() !== 'available') return false;

    return true;
  }) : [];

  const getUniqueValues = (field) => {
    if (!Array.isArray(products)) return [];
    return [...new Set(products
      .map(p => p[field])
      .filter(v => typeof v === 'string' && v.trim() !== '')
    )].sort();
  };

  const universities = getUniqueValues('university');
  const faculties = getUniqueValues('faculty');

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => setFilters({
    category: "",
    university: "",
    faculty: "",
    governorate: "",
    priceRange: [0, 100000],
    inStock: false,
    features: []
  });

  return (
    <div className={styles.marketplacePage}>
      {/* Hero Header */}
      <header className={styles.marketplaceHeader}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>Products</h1>
        </div>
      </header>

      {/* Main Content */}
      <section className={styles.marketplaceContent}>
        <div className={styles.container}>
          {/* Top Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.resultsCount}>
              {filteredProducts.length} Products
            </div>

            <div className={styles.filterActions}>
              {/* Category Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Category</span>
                <select
                  className={styles.filterSelect}
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* University Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>University</span>
                <select
                  className={styles.filterSelect}
                  value={filters.university}
                  onChange={(e) => handleFilterChange('university', e.target.value)}
                >
                  <option value="">All Universities</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              {/* Faculty Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Faculty</span>
                <select
                  className={styles.filterSelect}
                  value={filters.faculty}
                  onChange={(e) => handleFilterChange('faculty', e.target.value)}
                >
                  <option value="">All Faculties</option>
                  {faculties.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              {/* <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Sort By</span>
                <select className={styles.filterSelect}>
                  <option>Our Suggestions</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div> */}
            </div>
          </div>

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
                {/* Products Grid */}
                <ProductsGrid
                  products={filteredProducts}
                  allProductsCount={products.length}
                  filters={filters}
                  onFilterChange={setFilters}
                  categoryName={categories.find(c => c.id === Number(filters.category))?.name}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
