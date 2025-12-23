import React from "react";
import styles from "./FormInput.module.css";

const FormInput = React.forwardRef(({ label, error, ...props }, ref) => (
    <div className="mb-3">
        {label && <label className={styles.label}>{label}</label>}
        <input
            ref={ref}
            className={`${styles.input} ${error ? styles.errorBorder : ""}`}
            {...props}
        />
        {error && <p className={styles.errorText}>{error.message}</p>}
    </div>
));

export default FormInput;
