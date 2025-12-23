import React from 'react';
import HeroSection from './HeroSection';
import FeaturedProducts from '@components/ecommerce/FeaturedProducts/FeaturedProducts';
import CategoriesSection from '@components/ecommerce/Categories/CategoriesSection';
import Reviews from '@components/ecommerce/ReviewsSection/Reviews';

import { useProduct } from './../../hooks/useProducts';
import { useCategories } from './../../hooks/useCategories';
import SubscriptionPlans from '@components/ecommerce/SubscriptionPlans/SubscriptionPlans';
import ChatbotWidget from '@components/ecommerce/chatbot/ChatbotWidget';

export default function Home() {
    const { products, loading: loadingProducts, error: errorProducts } = useProduct();
    const { categories, loading: loadingCategories, error: errorCategories } = useCategories();

    if (loadingProducts || loadingCategories) return <p>Loading...</p>;
    if (errorProducts) return <p>Error loading products: {errorProducts}</p>;
    if (errorCategories) return <p>Error loading categories: {errorCategories}</p>;

    console.log(products);

    return (
        <>
            <HeroSection />
            <FeaturedProducts title="Featured Products" products={products} />
            <CategoriesSection categories={categories} />
            <Reviews />
            <SubscriptionPlans />
            <ChatbotWidget />

        </>
    );
}
