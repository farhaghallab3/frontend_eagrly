import React, { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";
import { useForm } from "react-hook-form";
import { useCategories } from "../../../../hooks/useCategories";
import { useProduct } from "../../../../hooks/useProducts";
import { toast } from "react-toastify";
import { FaUpload, FaImage, FaTimes, FaCheck, FaExclamationTriangle, FaMapMarkerAlt } from "react-icons/fa";
import SubscriptionModal from "../../../ecommerce/SubscriptionPlans/SubscriptionModal";

// Egypt governorates list
const EGYPT_GOVERNORATES = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
    "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
    "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
    "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
    "Luxor", "Qena", "North Sinai", "Sohag"
];

export default function ProductForm({ product, onClose, onSuccess, isRepublishing = false }) {
    const { refetchMyProducts } = useProduct();
    const { categories } = useCategories();
    const { addProduct, editProduct } = useProduct();
    const [preview, setPreview] = useState(product?.image || "");
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            category: "",
            university: "",
            faculty: "",
            status: "",
            image: null,
            condition: "",
            governorate: "",
        },
    });

    // Load existing product data for editing
    useEffect(() => {
        if (product) {
            setValue("title", product.title || "");
            setValue("description", product.description || "");
            setValue("price", product.price || 0);
            setValue("category", product.category_name || product.category?.name || "");
            setValue("university", product.university || "");
            setValue("faculty", product.faculty || "");
            setValue("status", product.status || "");
            setValue("condition", product.condition || "");
            setValue("governorate", product.governorate || "");
            if (product.image) setPreview(product.image);
        }
    }, [product, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "image") {
                if (value && typeof value !== "string") {
                    formData.append("image", value[0]);
                }
            } else if (key === "status" && !product) {
                formData.append("status", "draft");
                formData.append("is_active", "false");
            } else {
                formData.append(key, value);
            }
        });

        try {
            if (product) {
                await editProduct(product.id, formData);
            } else {
                await addProduct(formData);
            }

            refetchMyProducts();

            // Redundant success animation removed. Parent MyAds handles it.
            if (onSuccess) onSuccess(); // Signal success to parent
            if (onClose) onClose(); // Close form immediately

        } catch (error) {
            if (error.response?.data?.code === 'ad_limit_exceeded') {
                setShowSubscriptionModal(true);
            } else {
                console.error("Error saving product:", error);
                toast.error("Failed to save product. Please try again.");
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("image", e.target.files);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>
                {isRepublishing ? "Republish Ad" : (product ? "Edit Product" : "Add New Product")}
            </h1>

            <div className={styles.progressIndicator}>
                <div className={styles.progressStep}></div>
                <div className={styles.progressStep}></div>
                <div className={styles.progressStep}></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaCheck className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Basic Information</h2>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className={styles.input}
                            placeholder="Enter product title"
                        />
                        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Description</label>
                        <textarea
                            rows="4"
                            {...register("description", { required: "Description is required" })}
                            className={styles.textarea}
                            placeholder="Describe your product in detail"
                        ></textarea>
                        {errors.description && (
                            <p className={styles.error}>{errors.description.message}</p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" },
                            })}
                            className={styles.input}
                            placeholder="0.00"
                        />
                        {errors.price && <p className={styles.error}>{errors.price.message}</p>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category <span style={{ color: '#ef4444', fontSize: '1.2em' }}>*</span></label>
                        <select
                            {...register("category", {
                                required: "Please select a category",
                                validate: (value) => value !== "" || "Please select a category"
                            })}
                            className={styles.select}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className={styles.error}>{errors.category.message}</p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Condition</label>
                        <select
                            {...register("condition", { required: "Please select product condition" })}
                            className={styles.select}
                        >
                            <option value="">Select Condition</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                        {errors.condition && (
                            <p className={styles.error}>{errors.condition.message}</p>
                        )}
                    </div>
                </div>

                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaExclamationTriangle className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Academic Information</h2>
                    </div>

                    <div className={styles.formGroup}>
                        <label>University</label>
                        <input
                            type="text"
                            {...register("university", { required: "University is required" })}
                            className={styles.input}
                            placeholder="Enter your university name"
                        />
                        {errors.university && (
                            <p className={styles.error}>{errors.university.message}</p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Faculty/Department</label>
                        <input
                            type="text"
                            {...register("faculty", { required: "Faculty is required" })}
                            className={styles.input}
                            placeholder="Enter your faculty or department"
                        />
                        {errors.faculty && (
                            <p className={styles.error}>{errors.faculty.message}</p>
                        )}
                    </div>
                </div>

                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaMapMarkerAlt className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Location Information</h2>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Governorate <span style={{ color: '#ef4444', fontSize: '1.2em' }}>*</span></label>
                        <select
                            {...register("governorate", {
                                required: "Please select a governorate",
                                validate: (value) => value !== "" || "Please select a governorate"
                            })}
                            className={styles.select}
                        >
                            <option value="">Select your governorate</option>
                            {EGYPT_GOVERNORATES.map((gov) => (
                                <option key={gov} value={gov}>
                                    {gov}
                                </option>
                            ))}
                        </select>
                        {errors.governorate && (
                            <p className={styles.error}>{errors.governorate.message}</p>
                        )}
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            This helps buyers find products near their location
                        </p>
                    </div>
                </div>

                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaImage className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Product Images</h2>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Image</label>
                        <div className={styles.imageUpload}>
                            <FaUpload className={styles.uploadIcon} />
                            <div className={styles.uploadText}>Click to upload product image</div>
                            <div className={styles.uploadHint}>PNG, JPG up to 5MB</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                        </div>
                        {preview && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={preview}
                                    alt="Product Preview"
                                    className={styles.previewImage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        <FaTimes />
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn}>
                        <FaCheck />
                        {product ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
            <SubscriptionModal
                show={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
            />
        </div>
    );
}
