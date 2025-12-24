import React, { useEffect, useState } from "react";
import "./HeroSection.css";
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Discover Amazing",
            highlight: "Products",
            subtitle: "That Inspire You",
            description: "Your trusted marketplace for discovering quality products, connecting with sellers, and finding everything you need in one place.",
            cta: "Explore Marketplace",
            link: "/marketplace"
        },
        {
            title: "Connect with",
            highlight: "Trusted Sellers",
            subtitle: "Across Campus",
            description: "Build relationships with verified sellers in your university community. Quality products from people you can trust.",
            cta: "Find Sellers",
            link: "/marketplace"
        },
        {
            title: "Your Journey to",
            highlight: "Better Shopping",
            subtitle: "Starts Here",
            description: "Experience seamless shopping with our modern platform designed specifically for students and professionals.",
            cta: "Get Started",
            link: "/register"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <section className="hero-section">
            {/* Enhanced Background */}
            <div className="hero-background">
                {/* Floating Educational Items */}
                <div className="hero-images">
                    <div className="hero-image book"></div>
                    <div className="hero-image laptop"></div>
                    <div className="hero-image calculator"></div>
                    <div className="hero-image gradcap"></div>
                    <div className="hero-image tools"></div>
                    <div className="hero-image microscope"></div>
                    <div className="hero-image notebook"></div>
                </div>

                <div className="hero-particles"></div>

                {/* Geometric Shapes */}
                <div className="hero-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button className="hero-nav-arrow hero-nav-prev" onClick={prevSlide}>
                ‹
            </button>
            <button className="hero-nav-arrow hero-nav-next" onClick={nextSlide}>
                ›
            </button>

            {/* Slide Indicators */}
            <div className="hero-indicators">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>

            {/* Hero Content */}
            <div className="hero-content">
                <div className="container">
                    {/* Dynamic Badge */}
                    <div className="hero-badge">
                        <span>New Products Daily</span>
                        <div className="badge-pulse"></div>
                    </div>

                    {/* Hero Slides */}
                    <div className="hero-slides">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <div className="hero-header">
                                    <h1 className="hero-title">
                                        {slide.title} <span className="hero-title-highlight">{slide.highlight}</span>
                                        <br />
                                        <span className="hero-subtitle">{slide.subtitle}</span>
                                    </h1>
                                </div>

                                <p className="hero-description">
                                    {slide.description}
                                </p>

                                <div className="hero-actions">
                                    <Link to={slide.link} className="hero-cta-primary">
                                        <span>{slide.cta}</span>
                                    </Link>

                                    <button className="hero-cta-secondary" onClick={() => {
                                        const categoriesSection = document.getElementById('categories');
                                        if (categoriesSection) {
                                            categoriesSection.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    }}>
                                        <span>Browse Categories</span>
                                    </button>


                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Stats */}
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-content">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Quality Products</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-content">
                                <div className="stat-number">5K+</div>
                                <div className="stat-label">Active Sellers</div>
                            </div>
                        </div>
                        {/* Rating Removed */}
                        <div className="stat-item">
                            <div className="stat-content">
                                <div className="stat-number">50K+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="hero-trust">
                        <div className="trust-text">Trusted by universities worldwide</div>
                        <div className="trust-logos">
                            <div className="trust-logo">🏛️</div>
                            <div className="trust-logo">🎓</div>
                            <div className="trust-logo">📚</div>
                            <div className="trust-logo">🏆</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Scroll Indicator */}
            <div className="hero-scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <div className="scroll-text">Discover More</div>
                <div className="scroll-line"></div>
            </div>
        </section>
    );
}
