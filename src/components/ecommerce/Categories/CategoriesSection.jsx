import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './CategoriesSection.module.css';

export default function CategoriesSection({ categories }) {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}/products`);
    };

    return (
        <section id="categories" className={style.categoriesSection}>
            <div className="container">
                <div className={style.header}>
                    <h2 className={style.title}>Shop by Category</h2>
                    <p className={style.subtitle}>Discover products in your favorite categories</p>
                </div>

                <div className={style.grid}>
                    {categories && categories.map((category, index) => (
                        <div
                            key={category.id || index}
                            className={style.categoryCard}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <div className={style.cardImage}>
                                <img
                                    src={category.image || '/placeholder-category.jpg'}
                                    alt={category.title || category.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-category.jpg';
                                    }}
                                />
                                <div className={style.overlay}></div>
                            </div>
                            <div className={style.cardContent}>
                                <h3 className={style.categoryTitle}>
                                    {category.title || category.name}
                                </h3>
                                <p className={style.categoryDesc}>
                                    {category.description || 'Explore amazing products'}
                                </p>
                                <div className={style.exploreBtn}>
                                    <span>Explore</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
