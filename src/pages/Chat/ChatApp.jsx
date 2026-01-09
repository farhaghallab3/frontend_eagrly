import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Header from "@components/ecommerce/Chat/Header";
import ChatMessages from "@components/ecommerce/Chat/ChatMessage";
import MessageInput from "@components/ecommerce/Chat/MessageInput";
import ChatList from "@components/ecommerce/Chat/ChatList";
import { getChat, sendMessage } from "../../services/chatService";
import { setSelectedChat, fetchChats } from "../../store/slices/chatSlice";
import { useAuth } from "../../hooks/useAuth";
import { MdMessage, MdChevronLeft, MdChevronRight } from "react-icons/md";
import styles from "./ChatApp.module.css";

const ChatApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats, selectedChatId, loading, error } = useSelector((state) => state.chat);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { chatId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchChats());

    // Only lock body scroll if we are on wide screens to avoid mobile bugs
    if (window.innerWidth > 968) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [dispatch]);

  const handleSelectChat = (id) => {
    dispatch(setSelectedChat(id));
    navigate(`/chat/${id}`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const fetchChat = async () => {
      if (selectedChatId) {
        try {
          const chatData = await getChat(selectedChatId);
          setChat(chatData);
          setMessages(chatData.messages || []);
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          setSendError("Failed to fetch chat. Please try again later.");
        }
      }
    };

    fetchChat();
  }, [selectedChatId]);

  useEffect(() => {
    if (chatId) {
      const numericChatId = isNaN(chatId) ? chatId : Number(chatId);
      if (numericChatId !== selectedChatId) {
        dispatch(setSelectedChat(numericChatId));
      }
    }
  }, [chatId, selectedChatId, dispatch]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      setSendError(null);
      const newMessage = await sendMessage(selectedChatId, input);
      setMessages([...messages, newMessage]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setSendError("Failed to send message. Please try again.");
    }
  };

  const handlePhotosSelect = async (files) => {
    try {
      setSendError(null);
      for (const file of files) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const newMessage = await sendMessage(selectedChatId, base64, 'image');
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    } catch (error) {
      console.error("Failed to send photos:", error);
      setSendError("Failed to send photos. Please try again.");
    }
  };

  const formattedMessages = useMemo(() => {
    return messages.map((msg) => {
      let timeStr = "Just now";
      if (msg.timestamp) {
        const date = new Date(msg.timestamp);
        if (!isNaN(date.getTime())) {
          timeStr = date.toISOString();
        }
      }

      return {
        sender: msg.sender === user?.id ? "You" : "Other",
        text: msg.text,
        time: timeStr,
        type: msg.sender === user?.id ? "sent" : "received",
      };
    });
  }, [messages, user?.id]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorAlert}>
          {error}
        </div>
      </div>
    );
  }

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className={styles.chatContainer}>
      <motion.div
        className={`${styles.chatSidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Conversations</h3>
          <button
            className={styles.toggleButton}
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <MdChevronRight size={24} /> : <MdChevronLeft size={24} />}
          </button>
        </div>
        <div className={styles.sidebarContent}>
          <ChatList chats={chats} onSelectChat={handleSelectChat} />
        </div>
      </motion.div>

      <motion.div
        className={styles.chatMain}
        initial="hidden"
        animate="visible"
        variants={mainVariants}
      >
        <AnimatePresence mode="wait">
          {selectedChatId ? (
            <motion.div
              className={styles.chatConversation}
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Header chat={chat} />
              <ChatMessages messages={formattedMessages} />
              {sendError && (
                <div className={styles.errorAlert}>
                  {sendError}
                </div>
              )}
              <MessageInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                onPhotosSelect={handlePhotosSelect}
              />
            </motion.div>
          ) : (
            <motion.div
              className={styles.emptyState}
              key="empty"
              initial="hidden"
              animate="visible"
              variants={emptyStateVariants}
            >
              <div className={styles.emptyContent}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <MdMessage size={80} className={styles.emptyIcon} />
                </motion.div>
                <h3>Welcome to Messages</h3>
                <p>Select a conversation from the left to start chatting</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ChatApp;
