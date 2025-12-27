// ChatbotWidget.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";
// import { productService } from "../../../services/productService";
import { sendMessageToBot } from "../../../services/chatService";
// import { getUserIdFromToken } from "../../../utils/auth";
// import { getUserById } from "../../../services/userService";
import { useAuthModal } from "../../../context/AuthModalContext";
import styles from "./ChatbotWidget.module.css";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const toggleChat = () => {
    if (open) {
      // Clear conversation when closing chat
      setMessages([]);
      localStorage.removeItem('chatbotMessages');
      localStorage.removeItem('chatbotInitialized');
    }
    setOpen(!open);
  };

  // Show welcome message on initial open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "bot",
        content: "Looking for something specific? Can I help you?"
      }]);
    }
  }, [open]);


  // const fetchRecommendations = async () => {
  //   setLoading(true);
  //   try {
  //     const userId = getUserIdFromToken();

  //     if (!userId) {
  //       setMessages([{
  //         role: "bot",
  //         content: "Please log in to get personalized recommendations and use the chatbot.",
  //         showLoginPrompt: true
  //       }]);
  //       return;
  //     }

  //     // Fetch user profile to get university and faculty for filtering
  //     const userData = await getUserById(userId);
  //     const { university, faculty } = userData;

  //     const products = await productService.getAll();

  //     // Filter products by same university and faculty
  //     let filteredProducts;
  //     if (university && faculty) {
  //       filteredProducts = products.filter(product =>
  //         product.university === university && product.faculty === faculty
  //       );
  //     } else if (university) {
  //       filteredProducts = products.filter(product =>
  //         product.university === university
  //       );
  //     } else {
  //       filteredProducts = products; // fallback if no user data
  //     }

  //     if (filteredProducts.length === 0) {
  //       const botMsg = {
  //         role: "bot",
  //         content: "I understand you're looking for products in your area, but we currently don't have tools specifically listed for your university and faculty. However, I'm here to help you! Feel free to ask me about available products from other locations or describe what you're looking for, and I'll assist you with recommendations."
  //       };
  //       setMessages([botMsg]);
  //     } else {
  //       const recommendations = filteredProducts.slice(0, 6); // Show first 6 relevant products

  //       const botMsg = {
  //         role: "bot",
  //         content: "Here are some recommended products near your location:",
  //         products: recommendations
  //       };

  //       setMessages([botMsg]);
  //     }
  //   } catch (err) {
  //     console.error("Chatbot error:", err);

  //     setMessages([{
  //       role: "bot",
  //       content: "An error occurred while fetching recommendations. Please try again or type a message.",
  //     }]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToBot(input);

      if (response.authenticated === false) {
        const botMsg = {
          role: "bot",
          content: response.error || "Please log in to use the AI Assistant.",
          showLoginPrompt: true
        };
        setMessages(prev => [...prev, botMsg]);
      } else if (response.error) {
        const botMsg = {
          role: "bot",
          content: response.error
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Handle both array responses and object responses
        const products = Array.isArray(response) ? response :
          (response.recommendations || response.products || response.data || []);

        const botMsg = {
          role: "bot",
          content: response.reply || response.message || "",
          products: products
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, {
        role: "bot",
        content: "I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderBotMessage = (msg) => {
    if (msg.showLoginPrompt) {
      return (
        <div>
          <div>{msg.content}</div>
          <button
            className={styles.loginBtn}
            onClick={() => openAuthModal()}
          >
            Log In
          </button>
        </div>
      );
    }

    const hasProducts = msg.products && Array.isArray(msg.products) && msg.products.length > 0;
    const displayedProducts = showAll ? (msg.products || []) : (msg.products || []).slice(0, 3);

    return (
      <div>
        {/* Show text content if exists */}
        {msg.content && <div className={styles.botText}>{msg.content}</div>}

        {/* Show products if exist */}
        {hasProducts && (
          <div style={{ marginTop: '10px' }}>
            {displayedProducts.map(product => (
              <div
                key={product.id}
                className={styles.productPreview}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/product/${product.id || product._id}`);
                }}
              >
                <div
                  className={styles.productTitle}
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  {product.title}
                </div>
                <div className={styles.productMeta}>
                  Seller: {product.seller?.first_name || product.seller?.name || 'N/A'} |
                  University: {product.university || 'N/A'} |
                  Faculty: {product.faculty || 'N/A'} |
                  Category: {product.category_name || product.category || 'N/A'} |
                  Price: {product.price || 'N/A'} EGP |
                  Condition: {product.condition || 'N/A'}
                </div>
              </div>
            ))}

            {msg.products.length > 3 && (
              <button
                className={styles.seeMoreBtn}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `See ${msg.products.length - 3} more`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className={styles.widgetWrapper}>
      {!open && (
        <button className={styles.chatButton} onClick={toggleChat}>
          <FaRobot />
        </button>
      )}

      {open && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderContent}>
              <MdSmartToy className={styles.headerIcon} />
              <span>AI Assistant</span>
            </div>
            <button className={styles.closeButton} onClick={toggleChat} aria-label="Close chat">
              <FaTimes />
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${msg.role === "user" ? styles.user : styles.bot}`}
              >
                {msg.role === "user" ? msg.content : renderBotMessage(msg)}
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.typing}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
