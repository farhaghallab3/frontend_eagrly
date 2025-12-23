import React from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsGrid.module.css";
import featuredStyles from "../FeaturedProducts/FeaturedProducts.module.css";

const ProductsGrid = ({ products, allProductsCount, filters = {}, onFilterChange, categoryName }) => {
  const navigate = useNavigate();

  const handleRemoveFilter = (filterType) => {
    onFilterChange(prev => ({
      ...prev,
      [filterType]: filterType === 'priceRange' ? [0, 5000] :
        filterType === 'inStock' ? false :
          filterType === 'features' ? [] : ""
    }));
  };

  const handleViewDetails = (product) => {
    const productId = product.id || product._id;
    navigate(`/product/${productId}`);
  };

  return (
    <div className={styles.productsGrid}>
      {/* Active Filters */}
      <div className={styles.filtersSummary}>
        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {products.length} of {allProductsCount} products
          </span>
          {filters.category && (
            <span className={styles.activeFilter}>
              in {categoryName || filters.category}
            </span>
          )}
        </div>

        <div className={styles.activeFilters}>
          {filters.category && (
            <div className={styles.filterTag}>
              <span>Category: {categoryName || filters.category}</span>
              <button
                className={styles.removeFilter}
                onClick={() => handleRemoveFilter('category')}
                aria-label="Remove category filter"
              >
                ×
              </button>
            </div>
          )}
          {filters.university && (
            <div className={styles.filterTag}>
              <span>University: {filters.university}</span>
              <button
                className={styles.removeFilter}
                onClick={() => handleRemoveFilter('university')}
                aria-label="Remove university filter"
              >
                ×
              </button>
            </div>
          )}
          {filters.faculty && (
            <div className={styles.filterTag}>
              <span>Faculty: {filters.faculty}</span>
              <button
                className={styles.removeFilter}
                onClick={() => handleRemoveFilter('faculty')}
                aria-label="Remove faculty filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.gridContainer}>
        {products.length > 0 ? (
          products.filter(Boolean).map((product, index) => {
            const prodTitle = String(product.title || 'No Title');
            const prodDesc = String(product.description || 'No description available');
            const prodPrice = product.price || 'N/A';

            return (
              <div key={product.id || product._id} className={featuredStyles.productCard}>
                <div className={featuredStyles.cardBadge}>
                  <span className={featuredStyles.badgeNumber}>#{index + 1}</span>
                </div>

                <div className={featuredStyles.cardImageContainer}>
                  <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={prodTitle}
                    className={featuredStyles.cardImage}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className={featuredStyles.imageOverlay}>
                    <div className={featuredStyles.overlayContent}>
                      <button className={featuredStyles.quickViewBtn} onClick={() => handleViewDetails(product)}>
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>

                <div className={featuredStyles.cardContent}>
                  <div className={featuredStyles.productMeta}>
                    <span className={featuredStyles.productCategory}>
                      {product.category_name || product.category || 'Product'}
                    </span>
                    <span className={featuredStyles.productPrice}>
                      ${prodPrice}
                    </span>
                  </div>

                  <h3 className={featuredStyles.productTitle}>
                    {prodTitle}
                  </h3>

                  <p className={featuredStyles.productDescription}>
                    {prodDesc.substring(0, 100)}...
                  </p>

                  <div className={featuredStyles.cardActions}>
                    <button
                      className={featuredStyles.viewDetailsBtn}
                      onClick={() => handleViewDetails(product)}
                    >
                      View Details
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={featuredStyles.cardGlow}></div>
              </div>
            )
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <span>🔍</span>
            </div>
            <h3 className={styles.emptyTitle}>
              {allProductsCount === 0 ? 'No products available' : 'No products found'}
            </h3>
            <p className={styles.emptyDescription}>
              {allProductsCount === 0
                ? 'We\'re working on adding amazing products to our marketplace.'
                : 'Try adjusting your filters to discover more products.'
              }
            </p>
            {allProductsCount > 0 && (
              <button className={styles.clearFiltersBtn} onClick={() => onFilterChange({
                category: "",
                university: "",
                faculty: "",
                priceRange: [0, 5000],
                inStock: false,
                features: []
              })}>
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
