import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import ProductFilters from '@components/ecommerce/ProductFilters/ProductFilters';
import ProductsGrid from '@components/ecommerce/ProductsGrid/ProductsGrid';
import { productService } from '../../services/productService.js';
import { useCategories } from '../../hooks/useCategories.js';
import styles from './ProductsPage.module.css';
import SEO from "@components/common/SEO/SEO";
import { Aurora } from '@components/common/reactbits';
import CustomSelect from '@components/common/CustomSelect/CustomSelect';
// Egyptian Governorates
const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
  "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez",
  "Aswan", "Asyut", "Beni Suef", "Port Said", "Damietta", "Sharqia", "South Sinai",
  "Kafr El Sheikh", "Matruh", "Luxor", "Qena", "North Sinai", "Sohag"
].sort();

const MAX_PRICE = 10000;

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { categories } = useCategories();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: categoryFromUrl || "",
    governorate: "",
    faculty: "",
    priceMin: 0,
    priceMax: MAX_PRICE,
    inStock: false,
    features: []
  });

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
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
  }, [categoryFromUrl]);

  useEffect(() => { fetchProducts(); }, [categoryFromUrl, fetchProducts]);



  // Filter products safely
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (!product) return false;

    const prodCategory = String(product.category_name || product.category?.name || product.category || '').trim();
    const prodFaculty = String(product.faculty || '').trim();
    const prodGovernorate = String(product.governorate || '').trim();
    const prodPrice = Number(product.price || 0);
    const prodStatus = String(product.status || '').trim();

    if (filters.category && prodCategory.toLowerCase() !== String(filters.category || '').trim().toLowerCase()) return false;
    if (filters.faculty && prodFaculty.toLowerCase() !== String(filters.faculty || '').trim().toLowerCase()) return false;
    if (filters.governorate && prodGovernorate.toLowerCase() !== String(filters.governorate || '').trim().toLowerCase()) return false;

    // Price range filter
    if (prodPrice < filters.priceMin || prodPrice > filters.priceMax) return false;

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

  const faculties = getUniqueValues('faculty');

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceMinChange = (e) => {
    const value = Math.min(Number(e.target.value), filters.priceMax - 100);
    setFilters(prev => ({ ...prev, priceMin: value }));
  };

  const handlePriceMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), filters.priceMin + 100);
    setFilters(prev => ({ ...prev, priceMax: value }));
  };

  const clearAllFilters = () => setFilters({
    category: "",
    governorate: "",
    faculty: "",
    priceMin: 0,
    priceMax: MAX_PRICE,
    inStock: false,
    features: []
  });

  const hasActiveFilters = filters.category || filters.governorate || filters.faculty ||
    filters.priceMin > 0 || filters.priceMax < MAX_PRICE;

  // Calculate percentage for slider fill
  const minPercent = (filters.priceMin / MAX_PRICE) * 100;
  const maxPercent = (filters.priceMax / MAX_PRICE) * 100;

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className={styles.marketplacePage}>
      <div className={styles.backgroundContainer}>
        <Aurora
          colorStops={['#FFB300', '#FF8F00', '#FFC107']}
          amplitude={1.0}
          blend={0.5}
          speed={0.5}
          className={styles.auroraBackground}
        />
        <div className={styles.gridPattern}></div>
      </div>
      <SEO
        title="Marketplace"
        description="Browse thousands of student-listed items including textbooks, electronics, and art supplies."
        keywords="marketplace, buy, sell, student, university, books, electronics"
        url="/marketplace"
      />
      {/* Hero Header */}
      <motion.header
        className={styles.marketplaceHeader}
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>Products</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <section className={styles.marketplaceContent}>
        <div className={styles.container}>
          {/* Top Filter Bar */}
          <motion.div
            className={styles.filterBar}
            initial="hidden"
            animate="visible"
            variants={filterVariants}
          >
            <div className={styles.resultsCount}>
              {filteredProducts.length} Products
            </div>

            <div className={styles.filterActions}>
              {/* Category Filter */}
              <div className={styles.filterItem}>
                <CustomSelect
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
                  ]}
                  value={filters.category}
                  onChange={(val) => handleFilterChange('category', val)}
                  placeholder="All Categories"
                />
              </div>

              {/* Governorate Filter */}
              <div className={styles.filterItem}>
                <CustomSelect
                  options={[
                    { value: '', label: 'All Governorates' },
                    ...GOVERNORATES.map(gov => ({ value: gov, label: gov }))
                  ]}
                  value={filters.governorate}
                  onChange={(val) => handleFilterChange('governorate', val)}
                  placeholder="All Governorates"
                />
              </div>

              {/* Faculty Filter */}
              <div className={styles.filterItem}>
                <CustomSelect
                  options={[
                    { value: '', label: 'All Faculties' },
                    ...faculties.map(fac => ({ value: fac, label: fac }))
                  ]}
                  value={filters.faculty}
                  onChange={(val) => handleFilterChange('faculty', val)}
                  placeholder="All Faculties"
                />
              </div>

              {/* Inline Price Slider */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Price</span>
                <div className={styles.inlineSlider}>
                  <span className={styles.priceValue}>{filters.priceMin.toLocaleString()}</span>
                  <div className={styles.sliderWrapper}>
                    <div className={styles.sliderTrack}>
                      <div
                        className={styles.sliderRange}
                        style={{
                          left: `${minPercent}%`,
                          width: `${maxPercent - minPercent}%`
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={MAX_PRICE}
                      step="100"
                      value={filters.priceMin}
                      onChange={handlePriceMinChange}
                      className={styles.sliderInput}
                    />
                    <input
                      type="range"
                      min="0"
                      max={MAX_PRICE}
                      step="100"
                      value={filters.priceMax}
                      onChange={handlePriceMaxChange}
                      className={styles.sliderInput}
                    />
                  </div>
                  <span className={styles.priceValue}>{filters.priceMax.toLocaleString()}</span>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
                  Clear
                </button>
              )}
            </div>
          </motion.div>

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
