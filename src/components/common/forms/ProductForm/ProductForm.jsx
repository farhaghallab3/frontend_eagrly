import React, { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";
import { useForm } from "react-hook-form";
import { useCategories } from "../../../../hooks/useCategories";
import { useProduct } from "../../../../hooks/useProducts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaImage, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import SubscriptionModal from "../../../ecommerce/SubscriptionPlans/SubscriptionModal";
import SuccessAnimation from "../../feedback/SuccessAnimation";

export default function ProductForm({ product, onClose, onSuccess, isRepublishing = false }) {
    const navigate = useNavigate();
    const { refetchMyProducts } = useProduct();
    const { categories } = useCategories();
    const { addProduct, editProduct } = useProduct();
    const [preview, setPreview] = useState(product?.image || "");
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Success!");

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
        },
    });

    // عند تعديل منتج، نحط القيم القديمة
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
            if (product.image) setPreview(product.image);
        }
    }, [product, setValue]);

    // حفظ المنتج
    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "image") {
                // فقط إذا تم اختيار صورة جديدة
                if (value && typeof value !== "string") {
                    formData.append("image", value[0]);
                }
            } else if (key === "status" && !product) {
                // For new products, force draft status
                formData.append("status", "draft");
                formData.append("is_active", "false");
            } else {
                formData.append(key, value);
            }
        });

        try {
            if (product) {
                // تحديث المنتج (PATCH أفضل لتجنب مسح الحقول غير المرسلة)
                await editProduct(product.id, formData);
                if (isRepublishing) {
                    setSuccessMessage("Ad republished! Waiting for admin approval.");
                } else {
                    setSuccessMessage("Product updated successfully!");
                }
            } else {
                await addProduct(formData);
                setSuccessMessage("Product created! Waiting for admin approval.");
            }
            // toast.success("Product updated successfully!"); // Removed in favor of animation
            setShowSuccessAnimation(true);

            refetchMyProducts(); // تحديث المنتجات

            // Delay closing to show animation
            setTimeout(() => {
                setShowSuccessAnimation(false);
                if (onClose) onClose(); // إغلاق الفورم
                if (onSuccess) onSuccess(); // تحديث عند النجاح
            }, 3000); // 3 seconds display

        } catch (error) {
            if (error.response?.data?.code === 'ad_limit_exceeded') {
                // toast.error('You cannot add products until you pay for a package.');
                setShowSubscriptionModal(true);
            } else {
                // Handle other validation errors
                console.error("Error saving product:", error);
                toast.error("Failed to save product. Please try again.");
            }
        }
    };

    // معاينة الصورة
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("image", e.target.files); // تحديث قيمة الفورم
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.formContainer}>
            {showSuccessAnimation && <SuccessAnimation message={successMessage} />}
            <h1 className={styles.formTitle}>
                {isRepublishing ? "Republish Ad" : (product ? "Edit Product" : "Add New Product")}
            </h1>

            {/* Progress Indicator */}
            <div className={styles.progressIndicator}>
                <div className={styles.progressStep}></div>
                <div className={styles.progressStep}></div>
                <div className={styles.progressStep}></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Basic Information Section */}
                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaCheck className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Basic Information</h2>
                    </div>

                    {/* Title */}
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

                    {/* Description */}
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

                    {/* Price */}
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

                    {/* Category - REQUIRED */}
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

                    {/* Condition */}
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

                {/* Academic Information Section */}
                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaExclamationTriangle className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Academic Information</h2>
                    </div>

                    {/* University */}
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

                    {/* Faculty */}
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

                {/* Media Section */}
                <div className={styles.formSections}>
                    <div className={styles.sectionHeader}>
                        <FaImage className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Product Images</h2>
                    </div>

                    {/* Image Upload */}
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

                {/* Action Buttons */}
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
