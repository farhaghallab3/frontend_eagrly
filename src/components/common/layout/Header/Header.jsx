import React, { useState, useEffect, useRef } from "react";
import { MdMenu, MdNotifications, MdChat, MdFavorite, MdPerson, MdClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { useAuthModal } from "../../../../context/AuthModalContext";
import { fetchChats } from "../../../../store/slices/chatSlice";
import { fetchMyProducts } from "../../../../store/slices/productSlice";
import { fetchUnreadCount } from "../../../../store/slices/notificationSlice";
import { fetchWishlist } from "../../../../store/slices/wishlistSlice";
import ChatDropdown from "../ChatDropdown";
import NotificationsDropdown from "../NotificationsDropdown";
import styles from "./Header.module.css";

export default function Header({ links }) {
    const { user, logoutUser, token } = useAuth();
    const { openAuthModal } = useAuthModal();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { unreadCount } = useSelector((state) => state.chat);
    const { unreadCount: notificationCount } = useSelector((state) => state.notifications);
    const wishlistState = useSelector((state) => state.wishlist);
    const safeWishlistItems = wishlistState?.items?.results || [];

    const [showChatDropdown, setShowChatDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const headerRef = useRef(null);

    const navLinks = links || [
        { label: "Home", path: "/" },
        { label: "Marketplace", path: "/marketplace" },
        { label: "About Us", path: "/aboutus" },
    ];

    useEffect(() => {
        if (token) {
            dispatch(fetchChats());
            dispatch(fetchMyProducts());
            dispatch(fetchUnreadCount());
            dispatch(fetchWishlist());

            const notificationInterval = setInterval(() => {
                dispatch(fetchUnreadCount());
            }, 5000);

            return () => clearInterval(notificationInterval);
        }
    }, [token, dispatch]);

    // Close dropdowns and menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setShowChatDropdown(false);
                setShowNotificationsDropdown(false);
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className={styles.headerWrapper} ref={headerRef}>
            <div className={styles.navbar}>
                {/* Brand */}
                <Link to="/" className={styles.brand}>
                    <span className={styles.brandText}>EAGERLY</span>
                </Link>

                {/* Mobile Toggle */}
                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <nav className={`${styles.navCenter} ${isMenuOpen ? styles.navActive : ""}`}>
                    {navLinks.map(link => (
                        <Link
                            to={link.path}
                            key={link.path}
                            className={`${styles.navLink} ${location.pathname === link.path ? styles.activeLink : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Mobile Only Auth */}
                    {!token && (
                        <div className={styles.mobileAuth}>
                            <Link to="/login" className={styles.mobileNavLink}>Log in</Link>
                            <Link to="/register" className={styles.mobileCta}>Join Now</Link>
                        </div>
                    )}
                </nav>

                {/* Actions */}
                <div className={styles.navActions}>
                    {/* Icons Section */}
                    <div className={styles.iconActions}>
                        <div className={styles.iconWrapper}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => {
                                    if (!token) return openAuthModal();
                                    setShowNotificationsDropdown(!showNotificationsDropdown);
                                    setShowChatDropdown(false);
                                }}
                            >
                                <MdNotifications size={22} />
                                {token && notificationCount > 0 && (
                                    <span className={styles.badge}>{notificationCount > 99 ? '99+' : notificationCount}</span>
                                )}
                            </button>
                            {token && <NotificationsDropdown show={showNotificationsDropdown} onToggle={setShowNotificationsDropdown} />}
                        </div>

                        <div className={styles.iconWrapper}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => {
                                    if (!token) return openAuthModal();
                                    setShowChatDropdown(!showChatDropdown);
                                    setShowNotificationsDropdown(false);
                                }}
                            >
                                <MdChat size={22} />
                                {token && unreadCount > 0 && (
                                    <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                                )}
                            </button>
                            {token && <ChatDropdown show={showChatDropdown} onToggle={setShowChatDropdown} />}
                        </div>

                        <Link to="/wishlist" className={styles.iconBtn}>
                            <MdFavorite size={22} />
                            {token && safeWishlistItems.length > 0 && (
                                <span className={styles.badge}>{safeWishlistItems.length > 99 ? '99+' : safeWishlistItems.length}</span>
                            )}
                        </Link>
                    </div>

                    {/* Auth Section */}
                    {token ? (
                        <div className={styles.userMenu}>
                            <div className={styles.userInfo}>
                                <div className={styles.userAvatar}>
                                    <MdPerson size={20} />
                                </div>
                                <span className={styles.userName}>{user?.username || "User"}</span>
                            </div>
                            <div className={styles.userDropdown}>
                                <Link to="/my-ads">My Ads</Link>
                                <Link to="/dashboard/profile">Profile</Link>
                                <Link to="/dashboard">Dashboard</Link>
                                <button onClick={logoutUser} className={styles.logoutBtn}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.guestActions}>
                            <Link to="/login" className={styles.loginLink}>Log in</Link>
                            <Link to="/register" className={styles.ctaButton}>Join Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
