import React from "react";
import { useNavigate } from "react-router-dom"; // import navigate
import styles from "../FeaturedProducts/FeaturedProducts.module.css";
import ButtonPrimary from "@components/common/ButtonPrimary/ButtonPrimary";

export default function ProductCard({ product }) {
    const { id, title, description, image, buttonText = "Overview", name } = product;
    const navigate = useNavigate();

    const handleClick = () => {
        // If product has seller, it's a product; else it's a category
        if (product.seller) {
            navigate(`/product/${id || product._id}`); // navigate to product details page
        } else {
            navigate(`/categories/${id || product._id}/products`); // navigate to category products page
        }
    };

    return (
        <div className={`${styles.card} d-flex flex-column justify-content-between p-3`}>
            <div>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="mt-3">
                    <p className="text-white fw-bold">{title}{name}</p>
                    <p className="text-secondary small">{description}</p>
                </div>
            </div>
            <ButtonPrimary text={buttonText} onClick={handleClick} />
        </div>
    );
}
