import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";

export default function ProductCard({ product }) {
    const { id, title, description, image, buttonText = "Overview", name } = product;
    const navigate = useNavigate();

    const handleClick = () => {
        if (product.seller) {
            navigate(`/product/${id || product._id}`);
        } else {
            navigate(`/categories/${id || product._id}/products`);
        }
    };

    return (
        <div
            className={`${styles.card} d-flex flex-column justify-content-between p-3`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="mt-3">
                    <p className={styles.title}>{title}{name}</p>
                    <p className={styles.desc}>{description}</p>
                </div>
            </div>
            <ButtonPrimary text={buttonText} onClick={(e) => {
                e.stopPropagation();
                handleClick();
            }} />
        </div>
    );
}
