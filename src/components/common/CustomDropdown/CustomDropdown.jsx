import React, { useState, useRef, useEffect } from "react";
import styles from "./CustomDropdown.module.css";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt =>
        typeof opt === 'object' ? opt.value === value : opt === value
    );

    const getDisplayValue = () => {
        if (!value) return placeholder;
        if (typeof selectedOption === 'object') return selectedOption.label;
        return selectedOption || value;
    };

    const handleSelect = (optValue) => {
        onChange({ target: { value: optValue } });
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.dropdownTrigger} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? styles.selectedValue : styles.placeholder}>
                    {getDisplayValue()}
                </span>
                <FaChevronDown className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ''}`} />
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <div
                        className={`${styles.dropdownItem} ${!value ? styles.selected : ''}`}
                        onClick={() => handleSelect('')}
                    >
                        {placeholder}
                    </div>
                    {options.map((option, idx) => {
                        const optValue = typeof option === 'object' ? option.value : option;
                        const optLabel = typeof option === 'object' ? option.label : option;
                        const isSelected = value === optValue;

                        return (
                            <div
                                key={idx}
                                className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
                                onClick={() => handleSelect(optValue)}
                            >
                                {optLabel}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
