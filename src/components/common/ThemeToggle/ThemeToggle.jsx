import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            className={styles.toggleButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className={styles.iconWrapper}>
                <div className={`${styles.iconContainer} ${isDark ? styles.rotateOut : styles.rotateIn}`}>
                    <MdLightMode className={styles.sunIcon} />
                </div>
                <div className={`${styles.iconContainer} ${isDark ? styles.rotateIn : styles.rotateOut}`}>
                    <MdDarkMode className={styles.moonIcon} />
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;
