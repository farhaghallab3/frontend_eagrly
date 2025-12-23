import React, { useState, useEffect } from "react";
import { Container, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import ProductsGrid from '@components/ecommerce/ProductsGrid/ProductsGrid';
import { productService } from '../../services/productService.js';
import { getCategory } from '../../services/api.js';
import styles from './CategoryProductsPage.module.css';
import { FaTag, FaBox, FaStar } from "react-icons/fa";

const CategoryProductsPage = () => {
  const { categoryId } = useParams(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  
  const fetchProducts = async () => {
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
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory(categoryId);
      setCategory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
      fetchCategory();
    }
  }, [categoryId]);

  
  const featuredProducts = Array.isArray(products)
    ? products.filter(p => p.is_featured).slice(0, 6)
    : [];

  return (
    <div className={styles.categoryPage}>
      {/* Hero Section */}
      <section className={styles.categoryHero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGlow1}></div>
          <div className={styles.heroGlow2}></div>
          <div className={styles.heroGlow3}></div>
        </div>

        <Container className={styles.heroContent}>
          <div className={styles.categoryIcon}>
            <FaTag />
          </div>

          <h1 className={styles.heroTitle}>
            {category?.name || 'Category'} Products
          </h1>

          <p className={styles.heroSubtitle}>
            Discover our carefully curated collection of high-quality products in this category.
            Find exactly what you need with our premium selection.
          </p>

          <div className={styles.categoryStats}>
            <div className={styles.categoryStatItem}>
              <span className={styles.statNumber}>
                {Array.isArray(products) ? products.length : 0}+
              </span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.categoryStatItem}>
              <span className={styles.statNumber}>
                {featuredProducts.length}
              </span>
              <span className={styles.statLabel}>Featured</span>
            </div>
            <div className={styles.categoryStatItem}>
              <span className={styles.statNumber}>4.8</span>
              <span className={styles.statLabel}>Avg Rating</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className={styles.categoryContent}>
        <Container className={styles.contentContainer}>
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
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div className={styles.featuredSection}>
                  <FeaturedProducts
                    title="⭐ Featured in This Category"
                    products={featuredProducts}
                  />
                </div>
              )}

              {/* All Products Grid */}
              <ProductsGrid
                products={products}
                allProductsCount={products.length}
                categoryName={category?.name}
              />
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default CategoryProductsPage;
