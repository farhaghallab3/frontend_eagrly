import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "@components/ecommerce/Chat/Header";
import ChatMessages from "@components/ecommerce/Chat/ChatMessage";
import MessageInput from "@components/ecommerce/Chat/MessageInput";
import { getChat, sendMessage } from "../../services/chatService";
import { setSelectedChat, fetchChats } from "../../store/slices/chatSlice";
import { useAuth } from "../../hooks/useAuth";
import { Spinner, Alert } from "react-bootstrap";
import { MdMessage } from "react-icons/md";
import styles from "./ChatApp.module.css";

const ChatApp = () => {
  const dispatch = useDispatch();
  const { selectedChatId, loading, error } = useSelector((state) => state.chat);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState(null);
  const { chatId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

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
        // Convert file to base64 for sending
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
          timeStr = date.toISOString(); // Pass ISO string to child for consistent parsing
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
      {/* Main Chat Area */}
      <div className={styles.chatMain}>
        {selectedChatId ? (
          <div className={styles.chatConversation}>
            <Header chat={chat} />
            <ChatMessages messages={formattedMessages} />
            {sendError && (
              <div className={styles.errorAlertChat}>
                <Alert variant="danger" className="mb-0">
                  {sendError}
                </Alert>
              </div>
            )}
            <MessageInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              onPhotosSelect={handlePhotosSelect}
            />
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
    </div>
  );
};

export default ChatApp;
