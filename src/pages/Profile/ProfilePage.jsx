import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserById, partialUpdateUser } from "../../services/userService";
import { getUserIdFromToken } from "../../utils/auth";
import { FaUser, FaGraduationCap, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUserCircle, FaUniversity, FaBuilding, FaEnvelope, FaIdCard } from "react-icons/fa";
import styles from "./ProfilePage.module.css";

export default function UserProfile() {
    const userId = getUserIdFromToken();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [originalUser, setOriginalUser] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const data = await getUserById(userId);
                setUser(data);
                setOriginalUser(data);
            } catch (error) {
                console.error("ProfilePage: Error fetching user:", error);
                toast.error("Failed to load user info");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setEditing(true);
        setOriginalUser({ ...user });
    };

    const handleCancel = () => {
        setUser({ ...originalUser });
        setEditing(false);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await partialUpdateUser(userId, {
                first_name: user.first_name,
                last_name: user.last_name,
                university: user.university,
                faculty: user.faculty,
                phone: user.phone,
            });
            toast.success("Profile updated successfully!");
            setEditing(false);
            setOriginalUser({ ...user });
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorAlert}>
                    <h4>Access Denied</h4>
                    <p>You must be logged in to view your profile. Please sign in to continue.</p>
                    <a href="/login" className={styles.loginLink}>Go to Login</a>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorAlert}>
                    <h4>No user data found</h4>
                    <p>Please try logging in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            {/* Hero Section */}
            <section className={styles.profileHero}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroGlow1}></div>
                    <div className={styles.heroGlow2}></div>
                    <div className={styles.heroGlow3}></div>
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.profileAvatar}>
                        <FaUserCircle className={styles.avatarIcon} />
                    </div>
                    <h1 className={styles.heroTitle}>
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Student at {user.university || 'University'} • {user.faculty || 'Faculty'}
                    </p>
                    <div className={styles.profileStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0</span>
                            <span className={styles.statLabel}>Products Listed</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0</span>
                            <span className={styles.statLabel}>Items Sold</span>
                        </div>
                        {/* Rating Removed */}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.profileContent}>
                <div className={styles.contentGrid}>
                    {/* Profile Information */}
                    <div className={styles.mainPanel}>
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h3 className={styles.panelTitle}>
                                    <FaUser className={styles.panelIcon} />
                                    Personal Information
                                </h3>
                                {!editing ? (
                                    <button className={styles.editButton} onClick={handleEdit}>
                                        <FaEdit />
                                        Edit
                                    </button>
                                ) : (
                                    <div className={styles.editActions}>
                                        <button className={styles.cancelButton} onClick={handleCancel}>
                                            <FaTimes />
                                            Cancel
                                        </button>
                                        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                                            <FaSave />
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.panelContent}>
                                {/* Personal Details */}
                                <div className={styles.infoSection}>
                                    <h4 className={styles.sectionTitle}>Basic Information</h4>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaUser className={styles.fieldIcon} />
                                                Username
                                            </label>
                                            <span className={styles.fieldValue}>{user.username || 'Not provided'}</span>
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaIdCard className={styles.fieldIcon} />
                                                First Name
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="first_name"
                                                    value={user.first_name || ""}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.first_name || 'Not provided'}</span>
                                            )}
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaIdCard className={styles.fieldIcon} />
                                                Last Name
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="last_name"
                                                    value={user.last_name || ""}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.last_name || 'Not provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className={styles.infoSection}>
                                    <h4 className={styles.sectionTitle}>Contact Details</h4>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaEnvelope className={styles.fieldIcon} />
                                                Email
                                            </label>
                                            <span className={styles.fieldValue}>{user.email || 'Not provided'}</span>
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaPhone className={styles.fieldIcon} />
                                                Phone
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    value={user.phone || ""}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.phone || 'Not provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className={styles.infoSection}>
                                    <h4 className={styles.sectionTitle}>Academic Information</h4>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaUniversity className={styles.fieldIcon} />
                                                University
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="university"
                                                    value={user.university || ""}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.university || 'Not provided'}</span>
                                            )}
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaBuilding className={styles.fieldIcon} />
                                                Faculty
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    name="faculty"
                                                    value={user.faculty || ""}
                                                    onChange={handleChange}
                                                    className={styles.formInput}
                                                />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.faculty || 'Not provided'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Status - Moved from Sidebar */}
                                <div className={styles.infoSection}>
                                    <h4 className={styles.sectionTitle}>Account Status</h4>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaCalendarAlt className={styles.fieldIcon} />
                                                Member Since
                                            </label>
                                            <span className={styles.fieldValue}>
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaUser className={styles.fieldIcon} />
                                                Account Type
                                            </label>
                                            <span className={styles.fieldValue}>Student</span>
                                        </div>

                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}>
                                                <FaIdCard className={styles.fieldIcon} />
                                                Verification
                                            </label>
                                            <span className={styles.fieldValue} style={{ color: '#64ffda' }}>
                                                ✓ Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}
