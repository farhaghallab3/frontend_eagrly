import React from "react";
import { FaSlidersH } from "react-icons/fa";
import styles from "./ProductFilters.module.css";
import CustomDropdown from "../../common/CustomDropdown/CustomDropdown";

// Egypt governorates list
const EGYPT_GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
  "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
  "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
  "Luxor", "Qena", "North Sinai", "Sohag"
];

const ProductFilters = ({ filters, onFilterChange, products, onClearFilters, showCategoryFilter = true, categories = [] }) => {

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

  // Convert categories to dropdown options
  const categoryOptions = Array.isArray(categories)
    ? categories.map(cat => typeof cat === 'object' ? cat.name : cat)
    : [];

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <div className={styles.headerContent}>
          <FaSlidersH className={styles.headerIcon} />
          <span className={styles.headerTitle}>Filters</span>
        </div>
        <button className={styles.clearButton} onClick={onClearFilters}>Clear All</button>
      </div>

      <div className={styles.filtersContent}>
        {showCategoryFilter && (
          <div className={styles.filterGroup}>
            <CustomDropdown
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              options={categoryOptions}
              placeholder="All Categories"
            />
          </div>
        )}

        <div className={styles.filterGroup}>
          <CustomDropdown
            label="University"
            value={filters.university}
            onChange={(e) => handleFilterChange('university', e.target.value)}
            options={universities}
            placeholder="All Universities"
          />
        </div>

        <div className={styles.filterGroup}>
          <CustomDropdown
            label="Governorate"
            value={filters.governorate || ''}
            onChange={(e) => handleFilterChange('governorate', e.target.value)}
            options={EGYPT_GOVERNORATES}
            placeholder="All Governorates"
          />
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
              className={styles.rangeInput}
            />
            <div className={styles.priceDisplay}>
              <span className={styles.priceMin}>0 EGP</span>
              <span className={styles.priceMax}>{filters.priceRange[1]} EGP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
