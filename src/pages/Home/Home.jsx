import React from 'react';
import SEO from '@components/common/SEO/SEO';
import HeroSection from './HeroSection';
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import CategoriesSection from '@components/ecommerce/Categories/CategoriesSection';
import Reviews from '@components/ecommerce/ReviewsSection/Reviews';
import styles from './Home.module.css';

import { useProduct } from './../../hooks/useProducts';
import { useCategories } from './../../hooks/useCategories';
import { Aurora } from '@components/common/reactbits';
import SubscriptionPlans from '@components/ecommerce/SubscriptionPlans/SubscriptionPlans';
import ChatbotWidget from '@components/ecommerce/chatbot/ChatbotWidget';

export default function Home() {
    const { products, loading: loadingProducts, error: errorProducts } = useProduct();
    const { categories, loading: loadingCategories, error: errorCategories } = useCategories();

    // Show loading state only for data sections, not the entire page
    const isLoading = loadingProducts || loadingCategories;

    return (
        <>
            <SEO
                title="Home"
                description="The premier marketplace for university students to buy, sell, and exchange pre-owned items."
            />

            {/* HeroSection always renders - no dependency on API data */}
            <HeroSection />

            <div className={styles.contentWrapper}>
                <div className={styles.backgroundContainer}>
                    <Aurora
                        colorStops={['#FFB300', '#FF8F00', '#FFC107']}
                        amplitude={1.0}
                        blend={0.5}
                        speed={0.5}
                        className={styles.auroraBackground}
                    />
                    <div className={styles.gridPattern}></div>
                </div>

                {/* Featured Products - gracefully handle loading/error */}
                {isLoading ? (
                    <div className={styles.loadingSection}>Loading products...</div>
                ) : errorProducts ? (
                    <div className={styles.errorSection}>Unable to load products</div>
                ) : (
                    <FeaturedProducts title="Featured Products" products={products} />
                )}

                {/* Categories - gracefully handle loading/error */}
                {isLoading ? (
                    <div className={styles.loadingSection}>Loading categories...</div>
                ) : errorCategories ? (
                    <div className={styles.errorSection}>Unable to load categories</div>
                ) : (
                    <CategoriesSection categories={categories} />
                )}

                <SubscriptionPlans />

                {/* Reviews Section with React Bits animations */}
                <Reviews />
            </div>
            <ChatbotWidget />
        </>
    );
}
