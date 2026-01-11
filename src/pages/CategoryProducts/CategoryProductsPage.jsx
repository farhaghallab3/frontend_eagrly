import React, { useState, useEffect, useCallback } from "react";
import { Container, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import ProductsGrid from '@components/ecommerce/ProductsGrid/ProductsGrid';
import { productService } from '../../services/productService.js';
import { getCategory } from '../../services/api.js';
import styles from './CategoryProductsPage.module.css';
import { FaTag, FaBox, FaStar } from "react-icons/fa";
import { Aurora } from '@components/common/reactbits';
import SEO from "@components/common/SEO/SEO";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);


  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError(`Failed to fetch products: ${err.message}`);
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const fetchCategory = useCallback(async () => {
    try {
      const data = await getCategory(categoryId);
      setCategory(data);
    } catch (err) {
      console.error(err);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
      fetchCategory();
    }
  }, [categoryId, fetchProducts, fetchCategory]);




  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const getUniqueValues = (field) => {
    if (!Array.isArray(products)) return [];
    return [...new Set(products
      .map(p => p[field])
      .filter(v => typeof v === 'string' && v.trim() !== '')
    )].sort();
  };

  const universities = getUniqueValues('university');
  const faculties = getUniqueValues('faculty');

  const filteredProducts = products.filter(p => {
    if (selectedUniversity && p.university !== selectedUniversity) return false;
    if (selectedFaculty && p.faculty !== selectedFaculty) return false;
    return true;
  });

  return (
    <div className={styles.categoryPage}>
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
        title={`${category?.name || 'Category'} Products`}
        description={`Browse products in ${category?.name || 'various categories'}`}
        url={`/categories/${categoryId}/products`}
      />

      {/* Hero Header */}
      <header className={styles.categoryHeader}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>
            {category?.name || 'Category'} Products
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <section className={styles.categoryContent}>
        <div className={styles.contentContainer}>
          {/* Top Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.resultsCount}>
              {filteredProducts.length} Products
            </div>

            <div className={styles.filterActions}>
              {/* University Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>University</span>
                <select
                  className={`${styles.filterSelect} ${!selectedUniversity ? "placeholder-selected" : ""}`}
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
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
                  className={`${styles.filterSelect} ${!selectedFaculty ? "placeholder-selected" : ""}`}
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="">All Faculties</option>
                  {faculties.map(fac => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>Sort By</span>
                <select className={styles.filterSelect}>
                  <option>Our Suggestions</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

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
              {/* All Products Grid */}
              <ProductsGrid
                products={filteredProducts}
                allProductsCount={products.length}
                categoryName={category?.name}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryProductsPage;
