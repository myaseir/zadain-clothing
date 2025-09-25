import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/StateContext";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Loader2 } from "lucide-react";
import { urlFor } from "../lib/client";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import styles from "./OrderPage.module.css";

const OrderPage = () => {
  const ctx = useStateContext?.() || {};
  const { cartItems = [], totalPrice = 0, clearCart } = ctx;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const provinces = [
    "Sindh",
    "Punjab",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit-Baltistan"
  ];

  useEffect(() => {
    document.body.style.overflow = success ? "hidden" : "auto";
  }, [success]);

  const generateOrderNumber = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "ZAD-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      tempErrors.email = "Valid email is required";
    if (!formData.phone.match(/^03[0-9]{9}$/))
      tempErrors.phone = "Enter valid Pakistani phone (03XXXXXXXXX)";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";
    if (!formData.province) tempErrors.province = "Select a province";
    return tempErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );
    setFormData(trimmedData);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      setLoading(false);
      return;
    }

    try {
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);

      // Generate HTML table rows for items
      const itemsHtml = cartItems.map(item => `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.name}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.selectedSize || "N/A"}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">$${item.price * item.quantity}</td>
        </tr>
      `).join("");

      const emailPayload = {
        order_number: newOrderNumber,
        customer_name: trimmedData.name,
        customer_email: trimmedData.email,
        customer_phone: trimmedData.phone,
        shipping_address: `${trimmedData.address}, ${trimmedData.city}, ${trimmedData.province}`,
        postal_code: trimmedData.postalCode || "N/A",
        total_amount: totalPrice,
        items_html: itemsHtml // ✅ HTML rows for email template
      };

      await emailjs.send(
        "service_mls2gg7",    // your EmailJS service ID
        "template_oybag3u",   // your EmailJS template ID
        emailPayload,
        "s8wqDajRi8t_3F0cu"  // your EmailJS public key
      );

      setSuccess(true);
      toast.success("Order placed successfully! Confirmation email sent.");
      if (typeof clearCart === "function") clearCart();

      setTimeout(() => {
        setSuccess(false);
        window.location.href = "/";
      }, 5000);

    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send order email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <div className={styles.pageWrapper}>Your cart is empty</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.logo}>Zadain</h1>
              <p className={styles.tagline}>Premium Fashion for Every Style</p>
            </div>
            <p className={styles.secure}>Secure Checkout</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Checkout Form */}
        <section className={styles.formSection}>
          <h2 className={styles.formTitle}>Delivery Details</h2>
          <form onSubmit={handleSubmit}>
            {["name", "email", "phone", "address", "city"].map(field => (
              <div key={field}>
                <input
                  className={styles.input}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && <p className={styles.error}>{errors[field]}</p>}
              </div>
            ))}

            <div>
              <select
                className={styles.input}
                name="province"
                value={formData.province}
                onChange={handleChange}
              >
                <option value="">Select Province</option>
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
              {errors.province && <p className={styles.error}>{errors.province}</p>}
            </div>

            <div>
              <input
                className={styles.input}
                type="text"
                name="postalCode"
                placeholder="Postal Code (optional)"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className={styles.deliveryMethod}>
              <Truck />
              <p className={styles.deliveryText}>Cash on Delivery</p>
            </div>
            <p className={styles.deliverySub}>Arrives in 3-5 working days</p>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => window.history.back()}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className={styles.placeBtn}
                disabled={loading}
              >
                {loading && <Loader2 className={styles.spinner} size={18} />}
                {loading ? "Placing..." : "Place Order"}
              </button>
            </div>
          </form>
        </section>

        {/* Order Summary */}
        <aside className={styles.summary}>
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div
              key={`${item._id ?? item.id}-${item.selectedSize ?? "nosize"}`}
              className={styles.summaryItem}
            >
              <img
                src={urlFor(item.image?.[0]) || "/placeholder.png"}
                alt={item.name}
                className={styles.summaryImg}
                width={80}
                height={80}
              />
              <div className={styles.summaryDetails}>
                <p className={styles.summaryName}>{item.name}</p>
                {item.selectedSize && (
                  <p className={styles.summarySize}>Size: {item.selectedSize}</p>
                )}
                <p className={styles.summaryQty}>{item.quantity} × ${item.price}</p>
              </div>
              <p className={styles.summaryPrice}>${item.price * item.quantity}</p>
            </div>
          ))}
          <hr className={styles.divider} />
          <div className={styles.total}>
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </aside>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={styles.modalContent}
            >
              <h3 className={styles.modalTitle}>Order Placed Successfully!</h3>
              <p className={styles.orderNumber}>
                Order #: <strong>{orderNumber}</strong>
              </p>
              <p className={styles.modalMessage}>
                Thank you for shopping with Zadain. Your order confirmation has been sent to {formData.email}.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderPage;
