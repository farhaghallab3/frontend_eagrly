import React, { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { MdSchool, MdMenu, MdShoppingCart, MdPerson, MdNotifications, MdChat, MdLightMode, MdDarkMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { useTheme } from "../../../../context/ThemeContext";
import { fetchChats } from "../../../../store/slices/chatSlice";
import { fetchMyProducts } from "../../../../store/slices/productSlice";
import { fetchUnreadCount } from "../../../../store/slices/notificationSlice";
import ChatDropdown from "../ChatDropdown";
import NotificationsDropdown from "../NotificationsDropdown";
import styles from "./Header.module.css";

export default function Header({ links }) {
    const { user, logoutUser, token } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const { unreadCount } = useSelector((state) => state.chat);
    const { unreadCount: notificationCount } = useSelector((state) => state.notifications);

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
            console.log("Header: Initial fetch - chats, products, notifications");
            dispatch(fetchChats());
            dispatch(fetchMyProducts());
            dispatch(fetchUnreadCount());

            // Poll for new messages, product updates, and notifications every 30 seconds
            const interval = setInterval(() => {
                console.log("Header: Polling for updates...");
                dispatch(fetchChats());
                dispatch(fetchMyProducts());
                dispatch(fetchUnreadCount());
            }, 30000);

            return () => clearInterval(interval);
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
                                <Nav.Link as={Link} to="/dashboard" className={styles.iconLink}>
                                    <MdShoppingCart size={20} />
                                    <span>My Ads</span>
                                </Nav.Link>

                                {/* Notifications */}
                                <div className={styles.notificationsButtonContainer}>
                                    <button
                                        ref={notificationsButtonRef}
                                        className={styles.iconButton}
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
                                        target={notificationsButtonRef.current}
                                    />
                                </div>

                                {/* Chat */}
                                <div className={styles.chatButtonContainer}>
                                    <button
                                        className={styles.iconButton}
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

                                <div className={styles.userMenu}>
                                    <div className={styles.userInfo}>
                                        <MdPerson size={20} className={styles.userIcon} />
                                        <span className={styles.userName}>{user?.username || user?.first_name || "User"}</span>
                                    </div>
                                    <div className={styles.userDropdown}>
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
