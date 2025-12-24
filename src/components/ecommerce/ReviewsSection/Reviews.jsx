import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Reviews.module.css";

import { MdStar, MdStarBorder, MdFormatQuote } from "react-icons/md";

const reviews = [
    {
        name: "Sarah Johnson",
        role: "Product Manager",
        avatar: "SJ",
        text: "This marketplace has transformed how we discover and purchase products. The quality and variety are exceptional!",
        stars: 5,
        company: "TechCorp"
    },
    {
        name: "Michael Chen",
        role: "Designer",
        avatar: "MC",
        text: "Amazing platform with incredible user experience. Found exactly what I needed for my creative projects.",
        stars: 5,
        company: "DesignStudio"
    },
    {
        name: "Emily Rodriguez",
        role: "Entrepreneur",
        avatar: "ER",
        text: "The seller community is fantastic and the support team is incredibly responsive. Highly recommend!",
        stars: 5,
        company: "StartUp Inc"
    },
    {
        name: "David Kim",
        role: "Developer",
        avatar: "DK",
        text: "Outstanding marketplace with great products and seamless shopping experience. Will definitely shop again!",
        stars: 5,
        company: "CodeWorks"
    },
    {
        name: "Lisa Thompson",
        role: "Marketing Director",
        avatar: "LT",
        text: "Quality products, fast delivery, and excellent customer service. This is my go-to marketplace now.",
        stars: 4,
        company: "BrandAgency"
    },
];

const Reviews = () => {
    return (
        <section className={styles.reviewsSection}>
            <div className={styles.sectionBackground}>
                <div className={styles.bgGlow1}></div>
                <div className={styles.bgGlow2}></div>
                <div className={styles.bgGlow3}></div>
            </div>

            <div className="container position-relative" style={{ zIndex: 2 }}>
                <div className={styles.sectionHeader}>
                    <div className={styles.headerBadge}>
                        <span className={styles.badgeIcon}>💬</span>
                        <span>Testimonials</span>
                    </div>
                    <h2 className={styles.sectionTitle}>
                        What Our Customers Say
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Don't just take our word for it - hear from our satisfied customers
                    </p>
                </div>

                <div className={styles.reviewsContainer}>
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={{
                            nextEl: '.reviews-next',
                            prevEl: '.reviews-prev',
                        }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className={styles.reviewsSwiper}
                    >
                        {reviews.map((review, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={styles.reviewCard}>
                                    <div className={styles.quoteIcon}>
                                        <MdFormatQuote size={32} />
                                    </div>

                                    <div className={styles.stars}>
                                        {Array.from({ length: review.stars }).map((_, i) => (
                                            <MdStar key={i} className={styles.starFilled} />
                                        ))}
                                        {review.stars < 5 && Array.from({ length: 5 - review.stars }).map((_, i) => (
                                            <MdStarBorder key={i} className={styles.starEmpty} />
                                        ))}
                                    </div>

                                    <blockquote className={styles.reviewText}>
                                        {review.text}
                                    </blockquote>

                                    <div className={styles.reviewerInfo}>
                                        <div className={styles.avatar}>
                                            <span className={styles.avatarText}>{review.avatar}</span>
                                        </div>
                                        <div className={styles.reviewerDetails}>
                                            <cite className={styles.reviewerName}>{review.name}</cite>
                                            <div className={styles.reviewerMeta}>
                                                <span className={styles.reviewerRole}>{review.role}</span>
                                                <span className={styles.reviewerCompany}>{review.company}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={styles.navigationContainer}>
                        <button className={`${styles.navBtn} reviews-prev`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className={styles.swiperPagination}></div>
                        <button className={`${styles.navBtn} reviews-next`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
