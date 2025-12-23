import React from "react";
import styles from "./ButtonPrimary.module.css";

export default function ButtonPrimary({
    text,
    onClick,
    variant = "filled", // "filled" or "outline"
    icon: Icon,         // optional React icon component
    type = "button",    // "button", "submit", "reset"
    className = "",     // extra custom classes
    disabled = false,   // disabled state
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${variant === "outline" ? styles.outline : styles.filled} ${className}`}
        >
            {Icon && <Icon className="me-2" size={18} />}
            {text}
        </button>
    );
}
