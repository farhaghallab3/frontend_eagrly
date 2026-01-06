import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Select an option...",
    label,
    error,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev < options.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : options.length - 1
                    );
                    break;
                case "Enter":
                case " ":
                    e.preventDefault();
                    if (highlightedIndex >= 0) {
                        handleSelect(options[highlightedIndex]);
                    }
                    break;
                case "Escape":
                    setIsOpen(false);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, highlightedIndex, options]);

    // Scroll highlighted option into view
    useEffect(() => {
        if (isOpen && listRef.current && highlightedIndex >= 0) {
            const highlightedElement = listRef.current.children[highlightedIndex];
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex, isOpen]);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                // Set highlighted index to current selection when opening
                const currentIndex = options.findIndex((opt) => opt.value === value);
                setHighlightedIndex(currentIndex);
            }
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <button
                type="button"
                className={`${styles.trigger} ${isOpen ? styles.open : ""} ${error ? styles.error : ""
                    } ${disabled ? styles.disabled : ""}`}
                onClick={toggleDropdown}
                disabled={disabled}
            >
                <span className={selectedOption ? styles.value : styles.placeholder}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <MdKeyboardArrowDown
                    className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
                />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <ul className={styles.optionsList} ref={listRef}>
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                className={`${styles.option} ${value === option.value ? styles.selected : ""
                                    } ${highlightedIndex === index ? styles.highlighted : ""}`}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                <span className={styles.optionLabel}>{option.label}</span>
                                {value === option.value && (
                                    <MdCheck className={styles.checkIcon} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default CustomSelect;
