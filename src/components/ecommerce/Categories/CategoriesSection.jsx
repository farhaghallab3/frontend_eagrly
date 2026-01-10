import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import style from './CategoriesSection.module.css';

// React Bits Components
import { SplitText, TiltCard, SpotlightCard } from '@components/common/reactbits';

// Inline SVG placeholder for broken/missing category images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231a1a1a' width='400' height='300'/%3E%3Cpath d='M200 100c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z' fill='%23333'/%3E%3Crect x='120' y='180' width='160' height='8' rx='4' fill='%23333'/%3E%3Crect x='150' y='200' width='100' height='6' rx='3' fill='%23282828'/%3E%3C/svg%3E";

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

                    {/* SplitText Animation for Section Title */}
                    <SplitText
                        text="Shop by Category"
                        className={style.title}
                        delay={50}
                        splitBy="letter"
                        animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    />

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
                            <SpotlightCard
                                className={style.spotlightWrapper}
                                spotlightColor="rgba(255, 179, 0, 0.15)"
                                spotlightSize={400}
                            >
                                <div
                                    className={style.categoryCard}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div className={style.cardImage}>
                                        <img
                                            src={category.image || PLACEHOLDER_IMAGE}
                                            alt={category.title || category.name}
                                            onError={(e) => {
                                                e.target.src = PLACEHOLDER_IMAGE;
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
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
