
import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedin, FaTimes, FaLink, FaCheck } from 'react-icons/fa';
import styles from './ShareModal.module.css';

const ShareModal = ({ show, onHide, productUrl, productName }) => {
    const [copied, setCopied] = useState(false);

    if (!show) return null;

    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(`Check out ${productName} on Eagerly!`);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: FaFacebookF,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className: styles.facebook
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            className: styles.twitter
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            className: styles.whatsapp
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            className: styles.linkedin
        }
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(productUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onHide();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Share Product</h3>
                    <button className={styles.closeButton} onClick={onHide}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.socialGrid}>
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.socialButton} ${link.className}`}
                        >
                            <div className={styles.iconWrapper}>
                                <link.icon />
                            </div>
                            <span className={styles.buttonLabel}>{link.name}</span>
                        </a>
                    ))}
                </div>

                <div className={styles.copySection}>
                    <input
                        type="text"
                        value={productUrl}
                        readOnly
                        className={styles.linkInput}
                    />
                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                    >
                        {copied ? <FaCheck /> : <FaLink />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
