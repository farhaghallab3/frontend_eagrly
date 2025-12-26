import React, { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { MdSchool, MdMenu, MdShoppingCart, MdPerson, MdNotifications, MdChat, MdLightMode, MdDarkMode, MdFavorite } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { useTheme } from "../../../../context/ThemeContext";
import { fetchChats } from "../../../../store/slices/chatSlice";
import { fetchMyProducts } from "../../../../store/slices/productSlice";
import { fetchUnreadCount } from "../../../../store/slices/notificationSlice";
import { fetchWishlist } from "../../../../store/slices/wishlistSlice";
import ChatDropdown from "../ChatDropdown";
import NotificationsDropdown from "../NotificationsDropdown";
import styles from "./Header.module.css";

export default function Header({ links }) {
    const { user, logoutUser, token } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const { unreadCount } = useSelector((state) => state.chat);
    const { unreadCount: notificationCount } = useSelector((state) => state.notifications);
    const wishlistState = useSelector((state) => state.wishlist);
    const safeWishlistItems = wishlistState?.items?.results || [];

    // Remove test code - using real notificationCount now
    const [showChatDropdown, setShowChatDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const notificationsButtonRef = useRef(null);

    const navLinks = links || [
        { label: "Home", path: "/" },
        { label: "Marketplace", path: "/marketplace" },
        { label: "About Us", path: "/aboutus" },
    ];

    useEffect(() => {
        if (token) {
            console.log("Header: Initial fetch - chats, products, notifications, wishlist");
            dispatch(fetchChats());
            dispatch(fetchMyProducts());
            dispatch(fetchUnreadCount());
            dispatch(fetchWishlist());

            // Polling interval removed as per user request

        }
    }, [token, dispatch]);

    return (
        <Navbar expand="lg" className={`${styles.navbar} ${styles.glassEffect}`}>
            <Container fluid className={styles.container}>
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    <div className={styles.logoWrapper}>
                        <MdSchool size={32} className={styles.logoIcon} />
                        <span className={styles.brandText}>Eagerly</span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" className={styles.navbarToggler}>
                    <MdMenu className={styles.menuIcon} />
                </Navbar.Toggle>

                <Navbar.Collapse id="main-navbar" className={styles.navbarCollapse}>
                    <Nav className={styles.navCenter}>
                        {navLinks.map(link => (
                            <Nav.Link
                                as={Link}
                                to={link.path}
                                key={link.path}
                                className={styles.navLink}
                            >
                                {link.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <div className={styles.navActions}>
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
                        </button>

                        {token ? (
                            <div className={styles.authenticatedActions}>

                                {/* Notifications */}
                                <div className={styles.notificationsButtonContainer}>
                                    <button
                                        ref={notificationsButtonRef}
                                        className={`${styles.iconLink} ${styles.notificationsIcon}`}
                                        title="Notifications"
                                        onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                                    >
                                        <MdNotifications size={20} />
                                        {notificationCount > 0 && (
                                            <span className={styles.notificationBadge}>
                                                {notificationCount > 99 ? '99+' : notificationCount}
                                            </span>
                                        )}
                                    </button>
                                    <NotificationsDropdown
                                        show={showNotificationsDropdown}
                                        onToggle={setShowNotificationsDropdown}
                                    />
                                </div>

                                {/* Chat */}
                                <div className={styles.chatButtonContainer}>
                                    <button
                                        className={`${styles.iconLink} ${styles.chatIcon}`}
                                        title="Messages"
                                        onClick={() => setShowChatDropdown(!showChatDropdown)}
                                    >
                                        <MdChat size={20} />
                                        {unreadCount > 0 && (
                                            <span className={styles.notificationBadge}>
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <ChatDropdown
                                        show={showChatDropdown}
                                        onToggle={setShowChatDropdown}
                                    />
                                </div>

                                {/* Wishlist */}
                                <Nav.Link as={Link} to="/wishlist" className={`${styles.iconLink} ${styles.wishlistIcon}`}>
                                    <MdFavorite size={20} />
                                    {safeWishlistItems.length > 0 && (
                                        <span className={styles.notificationBadge}>
                                            {safeWishlistItems.length > 99 ? '99+' : safeWishlistItems.length}
                                        </span>
                                    )}
                                </Nav.Link>

                                <div className={styles.userMenu}>
                                    <div className={styles.userInfo}>
                                        <MdPerson size={20} className={styles.userIcon} />
                                        <span className={styles.userName}>{user?.username || user?.first_name || "User"}</span>
                                    </div>
                                    <div className={styles.userDropdown}>
                                        <Link to="/my-ads" className={styles.dropdownItem}>
                                            My Ads
                                        </Link>
                                        <Link to="/dashboard/profile" className={styles.dropdownItem}>
                                            Profile
                                        </Link>
                                        <Link to="/dashboard" className={styles.dropdownItem}>
                                            Dashboard
                                        </Link>
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={logoutUser}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.guestActions}>
                                <Nav.Link as={Link} to="/login" className={styles.navLink}>
                                    Log in
                                </Nav.Link>
                                <Button as={Link} to="/register" className={styles.ctaButton}>
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
