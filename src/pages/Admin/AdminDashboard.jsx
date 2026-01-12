import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheck, FaTrash, FaInbox, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/axiosInstance';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('messages');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get('/contact/admin/');
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages. Ensure you are an admin.");
            setLoading(false);
        }
    };

    const handleResolve = async (id, currentStatus) => {
        try {
            await axiosInstance.patch(`/contact/admin/${id}/`, {
                is_resolved: !currentStatus
            });
            toast.success(`Message marked as ${!currentStatus ? 'resolved' : 'pending'}`);
            fetchMessages(); // Refresh list
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await axiosInstance.delete(`/contact/admin/${id}/`);
            toast.success("Message deleted");
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Admin Dashboard</h1>
                    <p>Manage content and support requests</p>
                </div>

                <div className={styles.dashboardContent}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <div 
                            className={`${styles.navItem} ${activeTab === 'messages' ? styles.active : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <FaInbox /> Messages
                        </div>
                        {/* Placeholder for future admin modules */}
                        <div className={styles.navItem}>
                            <FaUserShield /> Users (Coming Soon)
                        </div>
                    </div>

                    {/* Main Content */}
                    <motion.div 
                        className={styles.mainPanel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {activeTab === 'messages' && (
                            <>
                                <div className={styles.panelHeader}>
                                    <h2 className={styles.panelTitle}>Contact Messages</h2>
                                    <span style={{color: 'var(--text-secondary)'}}>
                                        Total: {messages.length}
                                    </span>
                                </div>

                                {loading ? (
                                    <p>Loading...</p>
                                ) : messages.length === 0 ? (
                                    <div className={styles.emptyState}>No messages found.</div>
                                ) : (
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>User</th>
                                                    <th>Subject</th>
                                                    <th>Message</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {messages.map(msg => (
                                                    <tr key={msg.id}>
                                                        <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div>{msg.first_name} {msg.last_name}</div>
                                                            <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{msg.email}</div>
                                                        </td>
                                                        <td>{msg.subject}</td>
                                                        <td style={{maxWidth: '300px'}}>{msg.message}</td>
                                                        <td>
                                                            <span className={`${styles.statusBadge} ${msg.is_resolved ? styles.statusResolved : styles.statusPending}`}>
                                                                {msg.is_resolved ? 'Resolved' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button 
                                                                className={styles.actionBtn} 
                                                                onClick={() => handleResolve(msg.id, msg.is_resolved)}
                                                                title={msg.is_resolved ? "Mark Pending" : "Mark Resolved"}
                                                            >
                                                                <FaCheck style={{ opacity: msg.is_resolved ? 1 : 0.3 }} />
                                                            </button>
                                                            <button 
                                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                                onClick={() => handleDelete(msg.id)}
                                                                title="Delete"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
