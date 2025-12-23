import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChats, sendMessage, getChat } from "../../services/chatService";

// Async thunk for fetching chats
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getChats();
      return response.results || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch chats");
    }
  }
);

// Async thunk for sending a message
export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, text }, { rejectWithValue }) => {
    try {
      const response = await sendMessage(chatId, text);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send message");
    }
  }
);

// Helper function to calculate unread count for a chat
const calculateChatUnreadCount = (chat, lastReadTimestamp) => {
  if (!chat.messages || chat.messages.length === 0) return 0;

  const lastRead = lastReadTimestamp || 0;
  return chat.messages.filter(message =>
    new Date(message.timestamp).getTime() > lastRead
  ).length;
};

// Helper function to calculate total unread count across all chats
const calculateTotalUnreadCount = (chats, lastReadTimestamps, excludeChatId = null) => {
  return chats.reduce((total, chat) => {
    if (chat.id === excludeChatId) return total;
    const lastRead = lastReadTimestamps[chat.id] || 0;
    return total + calculateChatUnreadCount(chat, lastRead);
  }, 0);
};

// Helper function to load last read timestamps from localStorage
const loadLastReadTimestamps = () => {
  const timestamps = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('chat_') && key.endsWith('_lastRead')) {
      const chatId = key.replace('chat_', '').replace('_lastRead', '');
      timestamps[chatId] = parseInt(localStorage.getItem(key), 10);
    }
  }
  return timestamps;
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    unreadCount: 0,
    loading: false,
    error: null,
    selectedChatId: null,
    lastReadTimestamps: loadLastReadTimestamps(), // Load from localStorage
  },
  reducers: {
    setSelectedChat: (state, action) => {
      const chatId = action.payload;
      state.selectedChatId = chatId;

      if (chatId) {
        // Update last read timestamp for this chat
        const chat = state.chats.find(c => c.id === chatId);
        if (chat && chat.messages && chat.messages.length > 0) {
          const latestMessage = chat.messages[chat.messages.length - 1];
          state.lastReadTimestamps[chatId] = new Date(latestMessage.timestamp).getTime();
          localStorage.setItem(`chat_${chatId}_lastRead`, state.lastReadTimestamps[chatId]);
        }

        // Recalculate unread counts
        state.unreadCount = calculateTotalUnreadCount(state.chats, state.lastReadTimestamps, chatId);
      }
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    updateUnreadCounts: (state, action) => {
      // This would be called when new messages arrive via WebSocket
      const { chatId } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat && (!state.selectedChatId || state.selectedChatId !== chatId)) {
        chat.unreadCount = (chat.unreadCount || 0) + 1;
        state.unreadCount += 1;
      }
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
      state.chats.forEach(chat => {
        chat.unreadCount = 0;
      });
    },
    updateChatUnreadCounts: (state, action) => {
      // Update unread counts based on new chat data
      const newChats = action.payload;
      let newUnreadCount = 0;

      newChats.forEach(newChat => {
        const existingChat = state.chats.find(c => c.id === newChat.id);
        if (existingChat) {
          // Preserve existing unread count if not currently selected
          if (state.selectedChatId !== newChat.id) {
            newChat.unreadCount = existingChat.unreadCount || 0;
          }
        }
        newUnreadCount += newChat.unreadCount || 0;
      });

      state.chats = newChats;
      state.unreadCount = newUnreadCount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        // Update chats with calculated unread counts
        const newChats = action.payload;

        newChats.forEach(chat => {
          const lastRead = state.lastReadTimestamps[chat.id] || 0;
          chat.unreadCount = calculateChatUnreadCount(chat, lastRead);
        });

        state.chats = newChats;
        state.unreadCount = calculateTotalUnreadCount(newChats, state.lastReadTimestamps, state.selectedChatId);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendChatMessage.fulfilled, () => {
        // Message sent successfully
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSelectedChat, incrementUnreadCount, updateUnreadCounts, resetUnreadCount, updateChatUnreadCounts } = chatSlice.actions;
export default chatSlice.reducer;
