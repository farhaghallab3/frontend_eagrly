import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import style from './CategoriesSection.module.css';

export default function CategoriesSection({ categories }) {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}/products`);
    };

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };

    return (
        <section id="categories" className={style.categoriesSection}>
            <div className={style.sectionContainer}>
                <motion.div
                    className={style.header}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={headerVariants}
                >
                    <div className={style.headerBadge}>
                        <span>Featured Collection</span>
                    </div>
                    <h2 className={style.title}>Shop by Category</h2>
                    <p className={style.subtitle}>Discover products in your favorite categories</p>
                </motion.div>

                <motion.div
                    className={style.grid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    {categories && categories.map((category, index) => (
                        <motion.div
                            key={category.id || index}
                            variants={cardVariants}
                        >
                            <div
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
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
