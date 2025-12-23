import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { FaFilter, FaTimes, FaSlidersH } from "react-icons/fa";
import styles from "./ProductFilters.module.css";

const ProductFilters = ({ filters, onFilterChange, products, onClearFilters, showCategoryFilter = true, categories = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get unique values for filters from products
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
  const faculties = getUniqueValues('faculty');
  const features = ["Wireless", "4K Resolution", "Noise Cancelling"];

  const handleFilterChange = (filterType, value) => {
    onFilterChange(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    onFilterChange(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const activeFiltersCount = [
    filters.category,
    filters.university,
    filters.faculty,
    filters.inStock,
    ...filters.features
  ].filter(Boolean).length;

  return (
    <div className={styles.filtersContainer}>
      {/* Filter Header */}
      <div className={styles.filtersHeader}>
        <div className={styles.headerContent}>
          <FaSlidersH className={styles.headerIcon} />
          <span className={styles.headerTitle}>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={styles.activeCount}>{activeFiltersCount}</span>
          )}
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.clearButton}
            onClick={onClearFilters}
          >
            Clear All
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FaFilter className={styles.toggleIcon} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${styles.filtersContent} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        {/* Category Filter */}
        {showCategoryFilter && (
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <div className={styles.selectWrapper}>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.customSelect}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name || 'Uncategorized'}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        )}

        {/* University Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>University</label>
          <div className={styles.selectWrapper}>
            <Form.Select
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
              className={styles.customSelect}
            >
              <option value="">All Universities</option>
              {universities.map((university, index) => (
                <option key={index} value={university}>
                  {university}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {/* Faculty Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Faculty</label>
          <div className={styles.selectWrapper}>
            <Form.Select
              value={filters.faculty}
              onChange={(e) => handleFilterChange('faculty', e.target.value)}
              className={styles.customSelect}
            >
              <option value="">All Faculties</option>
              {faculties.map((faculty, index) => (
                <option key={index} value={faculty}>
                  {faculty}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Price Range</label>
          <div className={styles.priceRange}>
            <div className={styles.rangeSlider}>
              <Form.Range
                min={0}
                max={5000}
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className={styles.rangeInput}
              />
            </div>
            <div className={styles.priceDisplay}>
              <span className={styles.priceMin}>$0</span>
              <span className={styles.priceMax}>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Availability</label>
          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxMark}></span>
              <span className={styles.checkboxText}>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Features Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Features</label>
          <div className={styles.featuresList}>
            {features.map((feature, i) => (
              <label key={i} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxMark}></span>
                <span className={styles.checkboxText}>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button className={styles.applyButton}>
          <FaFilter className={styles.applyIcon} />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
