import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, author = 'Stuplies' }) => {
    const siteTitle = 'Stuplies - Student Marketplace';
    const finalTitle = title ? `${title} | Stuplies` : siteTitle;
    const finalDescription = description || "The premier marketplace for university students to buy, sell, and exchange pre-owned items. Join our growing community today.";
    const startUrl = 'https://stuplies.com'; // Replace with actual deployment URL if different
    const finalUrl = url ? `${startUrl}${url}` : startUrl;
    const finalImage = image ? `${startUrl}${image}` : `${startUrl}/og-image.jpg`;

    return (
        <Helmet>
            {/* Primary SEO */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:site_name" content="Stuplies" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />
        </Helmet>
    );
};

export default SEO;
