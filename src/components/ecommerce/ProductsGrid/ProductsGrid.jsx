import React from "react";
import { FaSearch } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import styles from "./ProductsGrid.module.css";
import ProductCard from "../ProductCard/ProductCard";

const ProductsGrid = ({ products, allProductsCount, filters = {}, onFilterChange, categoryName }) => {

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const emptyVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className={styles.productsGrid}>
      {/* Active Filters Summary */}
      <motion.div
        className={styles.filtersSummary}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
      </motion.div>

      {/* Products Grid Content */}
      <motion.div
        className={styles.gridContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={containerVariants}
      >
        {Array.isArray(products) && products.length > 0 ? (
          <>
            {products.map((product, index) => (
              <motion.div key={product.id || product._id || index} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div
            className={styles.emptyState}
            variants={emptyVariants}
            initial="hidden"
            animate="visible"
          >
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductsGrid;
