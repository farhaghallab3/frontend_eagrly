import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";
import { Link } from 'react-router-dom';
import { FaTint, FaBolt, FaPlus , FaAngellist } from "react-icons/fa";

export default function HeroSection() {
    return (
        <section className={styles["hero-section"]}>
            <div className={styles["hero-content"]}>
                <div className={styles.container}>

                    {/* Left: Text & Actions */}
                    <div className={styles["hero-left-col"]}>
                        <div className={styles["hero-header"]}>
                            <h1 className={styles["hero-title"]}>
                                Quality is Good.<br />
                                <span className={styles["hero-title-highlight"]}>Eagerly</span> Makes it Better.
                            </h1>
                        </div>

                        {/* Feature Icons Row (Style from Phizz Image) */}
                        <div className={styles["hero-features-row"]}>
                            <div className={styles["feature-circle-item"]}>
                                <div className={styles["circle-outline"]}>
                                    <FaAngellist size={22} />
                                </div>
                                <span className={styles["feature-label"]}>Quality</span>
                            </div>
                            <div className={styles["feature-circle-item"]}>
                                <div className={styles["circle-outline"]}>
                                    <FaBolt size={22} />
                                </div>
                                <span className={styles["feature-label"]}>Speed</span>
                            </div>
                            <div className={styles["feature-circle-item"]}>
                                <div className={styles["circle-outline"]}>
                                    <FaPlus size={22} />
                                </div>
                                <span className={styles["feature-label"]}>Trust</span>
                            </div>
                        </div>

                        <Link to="/marketplace" className={styles["hero-cta-primary"]}>
                            Explore Marketplace
                        </Link>
                    </div>

                    {/* Right: Products Visual (Image) */}
                    <div className={styles["hero-visual-right"]}>
                        <img
                            src="https://i.pinimg.com/736x/fb/a3/24/fba3248e68ff2600e1f671ac3f0db687.jpg"
                            alt="Tools"
                            className={styles["hero-banner-image"]}
                        />
                    </div>

                </div>
            </div>
        </section >
    );
}
