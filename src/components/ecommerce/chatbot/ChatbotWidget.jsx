// ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane, FaMicrophone, FaStop, FaSpinner } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";
import { sendMessageToBot } from "../../../services/chatService";

import styles from "./ChatbotWidget.module.css";
import axios from "axios";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializingAudio, setIsInitializingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();
  // Auth is optional now
  // const { user } = useAuth();


  const toggleChat = () => {
    // Public access allowed now
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
        content: "Looking for something specific? Can I help you?",
        audio: null
      }]);
    }
  }, [open]);

  const startRecording = async () => {
    console.log("Start recording clicked");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported in this browser or context (requires HTTPS or localhost).");
      return;
    }

    setIsInitializingAudio(true);
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendAudioMessage(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err.name === 'NotAllowedError') {
        alert("Microphone access was denied. Please allow microphone access in your browser settings to use voice features.");
      } else {
        alert(`Could not access microphone: ${err.message} `);
      }
    } finally {
      setIsInitializingAudio(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (audioBlob) => {
    setLoading(true);

    // Add temporary message for "Processing audio..."
    setMessages(prev => [...prev, {
      role: "user",
      content: "🎤 Voice Message",
      isAudio: true
    }]);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_message.webm');

      // Use axios directly or update chatService to support FormData
      // Here we assume we call the API directly or a modified service
      // For simplicity/compatibility, let's use a direct axios call if service doesn't support specific config easily
      // But let's try to stick to existing service pattern if possible, or modify it inline

      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("token");

      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await axios.post(`${API_URL}/chatbot/`, formData, { headers });
      const response = res.data;

      handleBotResponse(response);

    } catch (err) {
      console.error("Error sending voice message:", err);
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Sorry, I couldn't process your voice message."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToBot(input);
      handleBotResponse(response);
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

  const handleBotResponse = (response) => {
    if (response.error) {
      setMessages(prev => [...prev, { role: "bot", content: response.error }]);
      return;
    }

    const products = Array.isArray(response) ? response :
      (response.recommendations || response.products || response.data || []);

    const botMsg = {
      role: "bot",
      content: response.reply || response.message || "",
      products: products,
      audio: response.audio // Base64 audio string
    };

    setMessages(prev => [...prev, botMsg]);

    // Auto-play audio if present
    if (response.audio) {
      console.log("Playing audio response...");
      const audio = new Audio(response.audio);
      audio.play().catch(e => console.error("Auto-play blocked:", e));
    }
  };

  const renderBotMessage = (msg) => {
    const hasProducts = msg.products && Array.isArray(msg.products) && msg.products.length > 0;
    const displayedProducts = showAll ? (msg.products || []) : (msg.products || []).slice(0, 3);

    return (
      <div>
        {/* Show text content if exists */}
        {msg.content && <div className={styles.botText}>{msg.content}</div>}

        {/* Audio Player */}
        {msg.audio && (
          <div className={styles.audioPlayer}>
            <audio controls src={msg.audio} className={styles.audioElement} />
          </div>
        )}

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
                  {product.price} EGP
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
              placeholder={isRecording ? "Listening..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording}
              className={styles.textInput}
            />

            {/* Mic / Stop Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
              title={isRecording ? "Stop Recording" : "Voice Message"}
              disabled={isInitializingAudio}
            >
              {isInitializingAudio ? <FaSpinner className="animate-spin" /> : (isRecording ? <FaStop /> : <FaMicrophone />)}
            </button>

            <button onClick={sendMessage} disabled={isRecording || !input.trim()}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
