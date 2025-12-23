import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "@components/ecommerce/Chat/Header";
import ChatMessages from "@components/ecommerce/Chat/ChatMessage";
import MessageInput from "@components/ecommerce/Chat/MessageInput";
import ChatList from "@components/ecommerce/Chat/ChatList";
import { getChat, sendMessage } from "../../services/chatService";
import { sendChatMessage, setSelectedChat } from "../../store/slices/chatSlice";
import { useAuth } from "../../hooks/useAuth";
import { Spinner, Alert, Button } from "react-bootstrap";
import { MdMessage } from "react-icons/md";
import styles from "./ChatApp.module.css";

const ChatApp = () => {
  const dispatch = useDispatch();
  const { chats, selectedChatId, loading, error } = useSelector((state) => state.chat);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { chatId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchChat = async () => {
      if (selectedChatId) {
        try {
          const chatData = await getChat(selectedChatId);
          setChat(chatData);
          setMessages(chatData.messages);
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          setSendError("Failed to fetch chat. Please try again later.");
        }
      }
    };

    fetchChat();
  }, [selectedChatId]);

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      dispatch(setSelectedChat(chatId));
    }
  }, [chatId, selectedChatId, dispatch]);

  const handleSelectChat = (chatId) => {
    dispatch(setSelectedChat(chatId));
  };

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

  const formattedMessages = messages.map((msg) => ({
    sender: msg.sender === user?.id ? "You" : "Other",
    text: msg.text,
    time: new Date(msg.timestamp).toLocaleTimeString(),
    type: msg.sender === user?.id ? "sent" : "received",
  }));

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Spinner animation="border" variant="info" className={styles.loadingSpinner} />
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

  return (
    <div className={styles.chatContainer}>
      {/* Sidebar Toggle Button - Mobile */}
      <Button
        className={`${styles.sidebarToggle} d-md-none`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        variant="outline-light"
      >
        <MdMessage size={20} />
      </Button>

      {/* Sidebar */}
      <div className={`${styles.chatSidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h4>Messages</h4>
        </div>
        <div className={styles.sidebarContent}>
          <ChatList chats={chats} onSelectChat={(chatId) => {
            handleSelectChat(chatId);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }} />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.chatMain}>
        {selectedChatId ? (
          <div className={styles.chatConversation}>
            <Header chat={chat} />
            <div className={styles.messagesContainer}>
              <ChatMessages messages={formattedMessages} />
            </div>
            {sendError && (
              <div className={styles.errorAlertChat}>
                <Alert variant="danger" className="mb-0">
                  {sendError}
                </Alert>
              </div>
            )}
            <MessageInput input={input} setInput={setInput} handleSend={handleSend} />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <MdMessage size={80} className={styles.emptyIcon} />
              <h3>Welcome to Messages</h3>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className={`${styles.sidebarOverlay} d-md-none`}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatApp;
