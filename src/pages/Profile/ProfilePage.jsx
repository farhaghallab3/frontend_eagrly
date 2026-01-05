import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserById, partialUpdateUser } from "../../services/userService";
import { getUserIdFromToken } from "../../utils/auth";
import { FaUser, FaPhone, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUserCircle, FaUniversity, FaBuilding, FaEnvelope, FaIdCard } from "react-icons/fa";
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
            toast.success("Profile updated!");
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
                <p>Loading Profile...</p>
            </div>
        );
    }

    if (!userId || !user) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorAlert}>
                    <h4>Access Denied</h4>
                    <p>Please log in to view your profile.</p>
                    <a href="/login" className={styles.loginLink}>Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                {/* Hero Section */}
                <section className={styles.profileHero}>
                    <div className={styles.heroContent}>
                        <div className={styles.profileAvatar}>
                            <FaUserCircle className={styles.avatarIcon} />
                        </div>
                        <h1 className={styles.heroTitle}>
                            {user.first_name || 'User'} {user.last_name || 'Profile'}
                        </h1>
                        <p className={styles.heroSubtitle}>
                            {user.university || 'Marketplace Member'} {user.faculty ? `• ${user.faculty}` : ''}
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className={styles.profileContent}>
                    <div className={styles.contentGrid}>
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h3 className={styles.panelTitle}>
                                    <FaUser className={styles.panelIcon} />
                                    Account Details
                                </h3>
                                {!editing ? (
                                    <button className={styles.editButton} onClick={handleEdit}>
                                        <FaEdit /> <span>Edit Details</span>
                                    </button>
                                ) : (
                                    <div className={styles.editActions}>
                                        <button className={styles.cancelButton} onClick={handleCancel}>
                                            <FaTimes /> <span>Cancel</span>
                                        </button>
                                        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
                                            <FaSave /> <span>{saving ? "Saving..." : "Save Changes"}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.panelContent}>
                                {/* Basic Info */}
                                <div className={styles.infoSection}>
                                    <span className={styles.sectionTitle}>Basic Information</span>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaUser className={styles.fieldIcon} /> Username</label>
                                            <span className={styles.fieldValue}>{user.username}</span>
                                        </div>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaIdCard className={styles.fieldIcon} /> First Name</label>
                                            {editing ? (
                                                <input type="text" name="first_name" value={user.first_name || ""} onChange={handleChange} className={styles.formInput} />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.first_name || '—'}</span>
                                            )}
                                        </div>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaIdCard className={styles.fieldIcon} /> Last Name</label>
                                            {editing ? (
                                                <input type="text" name="last_name" value={user.last_name || ""} onChange={handleChange} className={styles.formInput} />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.last_name || '—'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className={styles.infoSection}>
                                    <span className={styles.sectionTitle}>Contact & Academic</span>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaEnvelope className={styles.fieldIcon} /> Email</label>
                                            <span className={styles.fieldValue}>{user.email}</span>
                                        </div>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaPhone className={styles.fieldIcon} /> Phone</label>
                                            {editing ? (
                                                <input type="text" name="phone" value={user.phone || ""} onChange={handleChange} className={styles.formInput} />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.phone || '—'}</span>
                                            )}
                                        </div>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaUniversity className={styles.fieldIcon} /> University</label>
                                            {editing ? (
                                                <input type="text" name="university" value={user.university || ""} onChange={handleChange} className={styles.formInput} />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.university || '—'}</span>
                                            )}
                                        </div>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaBuilding className={styles.fieldIcon} /> Faculty</label>
                                            {editing ? (
                                                <input type="text" name="faculty" value={user.faculty || ""} onChange={handleChange} className={styles.formInput} />
                                            ) : (
                                                <span className={styles.fieldValue}>{user.faculty || '—'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Metadata */}
                                <div className={styles.infoSection}>
                                    <span className={styles.sectionTitle}>Account Status</span>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoField}>
                                            <label className={styles.fieldLabel}><FaCalendarAlt className={styles.fieldIcon} /> Verification</label>
                                            <span className={styles.fieldValue} style={{ color: '#FFB300' }}>✓ Verified Account</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
