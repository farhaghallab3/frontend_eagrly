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

              {/* Governorate Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Governorate</span>
                <select
                  className={styles.filterSelect}
                  value={filters.governorate}
                  onChange={(e) => handleFilterChange('governorate', e.target.value)}
                >
                  <option value="">All Governorates</option>
                  {GOVERNORATES.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
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
