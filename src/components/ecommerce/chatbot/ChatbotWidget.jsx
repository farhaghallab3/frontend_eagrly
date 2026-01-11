// ChatbotWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane, FaMicrophone, FaStop, FaSpinner, FaPlay, FaPause, FaImage, FaCheck } from "react-icons/fa";
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
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRefs = useRef({});

  // Transcription Preview States
  const [transcribedText, setTranscribedText] = useState("");
  const [showTranscriptionPreview, setShowTranscriptionPreview] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        transcribeAudio(audioBlob);

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

  // Transcribe audio and show preview for editing
  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_message.webm');
      formData.append('transcribe_only', 'true');

      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("token");

      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await axios.post(`${API_URL}/chatbot/`, formData, { headers });
      const response = res.data;

      if (response.transcription) {
        setTranscribedText(response.transcription);
        setShowTranscriptionPreview(true);
      } else {
        // Fallback if transcription failed
        setMessages(prev => [...prev, {
          role: "bot",
          content: "Sorry, I couldn't transcribe your voice message. Please try again or type your message."
        }]);
      }
    } catch (err) {
      console.error("Error transcribing voice message:", err);
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Sorry, I couldn't process your voice message."
      }]);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle canceling transcription preview
  const cancelTranscription = () => {
    setTranscribedText("");
    setShowTranscriptionPreview(false);
  };

  // Handle sending transcribed text
  const sendTranscribedMessage = () => {
    if (!transcribedText.trim()) return;
    setInput(transcribedText);
    setShowTranscriptionPreview(false);
    setTranscribedText("");
    // Use setTimeout to allow state to update before sending
    setTimeout(() => {
      sendMessageWithText(transcribedText.trim());
    }, 0);
  };

  // Image upload handlers
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Core message sending function that handles both text and images
  const sendMessageWithText = async (messageText) => {
    if (!messageText.trim() && !selectedImage) return;

    const userContent = messageText.trim() || (selectedImage ? "[Image attached]" : "");
    const newMessage = {
      role: "user",
      content: userContent,
      hasImage: !!selectedImage,
      imagePreview: imagePreview
    };

    // Capture image before clearing for API call
    const imageToSend = selectedImage;

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Clear image preview immediately after message is displayed
    setSelectedImage(null);
    setImagePreview(null);

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("token");

      let response;

      if (imageToSend) {
        // Send with image
        const formData = new FormData();
        formData.append('message', messageText.trim());
        formData.append('image', imageToSend);

        const headers = {
          'Content-Type': 'multipart/form-data',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await axios.post(`${API_URL}/chatbot/`, formData, { headers });
        response = res.data;
      } else {
        // Send text only
        response = await sendMessageToBot(messageText.trim());
      }

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

  const sendMessage = async () => {
    sendMessageWithText(input);
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
      products: products
    };

    setMessages(prev => [...prev, botMsg]);
  };

  const playVoiceMessage = (messageId, audioUrl) => {
    if (playingMessageId === messageId) {
      // Stop playing
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].pause();
        audioRefs.current[messageId].currentTime = 0;
      }
      setPlayingMessageId(null);
    } else {
      // Stop any currently playing audio
      if (playingMessageId && audioRefs.current[playingMessageId]) {
        audioRefs.current[playingMessageId].pause();
        audioRefs.current[playingMessageId].currentTime = 0;
      }

      // Start playing new audio
      if (!audioRefs.current[messageId]) {
        audioRefs.current[messageId] = new Audio(audioUrl);
        audioRefs.current[messageId].onended = () => setPlayingMessageId(null);
      }
      audioRefs.current[messageId].play();
      setPlayingMessageId(messageId);
    }
  };

  const renderVoiceMessage = (msg, messageId) => {
    const isPlaying = playingMessageId === messageId;

    return (
      <div className={styles.voiceMessage}>
        <button
          onClick={() => playVoiceMessage(messageId, msg.audioUrl)}
          className={styles.voicePlayButton}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className={styles.voiceWaveform}>
          <div className={`${styles.waveBar} ${isPlaying ? styles.playing : ''}`}></div>
          <div className={`${styles.waveBar} ${isPlaying ? styles.playing : ''}`}></div>
          <div className={`${styles.waveBar} ${isPlaying ? styles.playing : ''}`}></div>
          <div className={`${styles.waveBar} ${isPlaying ? styles.playing : ''}`}></div>
          <div className={`${styles.waveBar} ${isPlaying ? styles.playing : ''}`}></div>
        </div>
        <span className={styles.voiceDuration}>0:05</span>
      </div>
    );
  };

  const renderBotMessage = (msg) => {
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
                {msg.hasImage && msg.imagePreview && (
                  <div className={styles.messageImage}>
                    <img src={msg.imagePreview} alt="Attached" />
                  </div>
                )}
                {msg.isAudio ? renderVoiceMessage(msg, idx) : (msg.role === "user" ? msg.content : renderBotMessage(msg))}
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

          {/* Transcription Preview */}
          {showTranscriptionPreview && (
            <div className={styles.transcriptionPreview}>
              <div className={styles.transcriptionLabel}>Edit your message:</div>
              <textarea
                className={styles.transcriptionInput}
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className={styles.transcriptionButtons}>
                <button
                  className={styles.cancelBtn}
                  onClick={cancelTranscription}
                >
                  Cancel
                </button>
                <button
                  className={styles.sendBtn}
                  onClick={sendTranscribedMessage}
                  disabled={!transcribedText.trim()}
                >
                  <FaCheck /> Send
                </button>
              </div>
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && (
            <div className={styles.transcribingIndicator}>
              <FaSpinner className={styles.spinnerIcon} />
              <span>Transcribing...</span>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className={styles.imagePreviewContainer}>
              <img src={imagePreview} alt="Selected" className={styles.imagePreviewImg} />
              <button
                className={styles.imagePreviewClose}
                onClick={removeImage}
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className={styles.chatInput}>
            {/* Hidden file input for image upload */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <input
              type="text"
              placeholder={isRecording ? "Listening..." : (isTranscribing ? "Transcribing..." : "Type a message...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording || isTranscribing || showTranscriptionPreview}
              className={styles.textInput}
            />

            {/* Image Upload Button */}
            <button
              onClick={() => imageInputRef.current?.click()}
              className={styles.imageButton}
              title="Attach image"
              disabled={isRecording || isTranscribing || showTranscriptionPreview}
            >
              <FaImage />
            </button>

            {/* Mic / Stop Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
              title={isRecording ? "Stop Recording" : "Voice Message"}
              disabled={isInitializingAudio || isTranscribing || showTranscriptionPreview}
            >
              {isInitializingAudio ? <FaSpinner className="animate-spin" /> : (isRecording ? <FaStop /> : <FaMicrophone />)}
            </button>

            <button onClick={sendMessage} disabled={isRecording || isTranscribing || showTranscriptionPreview || (!input.trim() && !selectedImage)}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
