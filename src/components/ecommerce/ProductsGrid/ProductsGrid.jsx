import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./ProductsGrid.module.css";
import ProductCard from "../ProductCard/ProductCard";

const ProductsGrid = ({ products, allProductsCount, filters = {}, onFilterChange, categoryName }) => {
  return (
    <div className={styles.productsGrid}>
      {/* Active Filters Summary */}
      <div className={styles.filtersSummary}>
        <div className={styles.activeFilters}>
          {filters.category && (
            <div className={styles.filterTag}>
              <span>Category: {categoryName || filters.category}</span>
              <button
                className={styles.removeFilter}
                onClick={() => onFilterChange(prev => ({ ...prev, category: "" }))}
                aria-label="Remove category filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid Content */}
      <div className={styles.gridContainer}>
        {Array.isArray(products) && products.length > 0 ? (
          <>
            {products.map((product, index) => (
              <ProductCard key={product.id || product._id || index} product={product} />
            ))}
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FaSearch />
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
                priceRange: [0, 100000],
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
