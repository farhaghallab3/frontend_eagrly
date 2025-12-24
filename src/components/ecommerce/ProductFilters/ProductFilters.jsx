import React, { useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import styles from "./ProductFilters.module.css";

const ProductFilters = ({ filters, onFilterChange, products, onClearFilters, showCategoryFilter = true, categories = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getUniqueValues = (field) => {
    if (!Array.isArray(products)) return [];
    return [...new Set(products
      .map(product => {
        const value = product[field];
        return typeof value === 'string' ? value.trim() : String(value || '');
      })
      .filter(value => value !== '')
    )].sort();
  };

  const universities = getUniqueValues('university');

  const handleFilterChange = (filterType, value) => {
    onFilterChange(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <div className={styles.headerContent}>
          <FaSlidersH className={styles.headerIcon} />
          <span className={styles.headerTitle}>Filters</span>
        </div>
        <button className={styles.clearButton} onClick={onClearFilters}>Clear All</button>
      </div>

      <div className={styles.filtersContent} style={{ display: 'block', opacity: 1, visibility: 'visible', maxHeight: 'none' }}>
        {showCategoryFilter && (
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <div className={styles.selectWrapper}>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.customSelect}
                style={{ background: '#0a192f', color: 'white', border: '2px solid rgba(100, 255, 218, 0.2)', borderRadius: '12px', padding: '12px 16px', width: '100%' }}
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) && categories.map((cat, idx) => (
                  <option key={idx} value={cat.name || cat}>
                    {cat.name || cat || 'Uncategorized'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>University</label>
          <div className={styles.selectWrapper}>
            <select
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
              className={styles.customSelect}
              style={{ background: '#0a192f', color: 'white', border: '2px solid rgba(100, 255, 218, 0.2)', borderRadius: '12px', padding: '12px 16px', width: '100%' }}
            >
              <option value="">All Universities</option>
              {universities.map((uni, idx) => (
                <option key={idx} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price Range</label>
          <div className={styles.priceRange}>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', color: '#64ffda', fontWeight: 'bold' }}>
              <span>$0</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
