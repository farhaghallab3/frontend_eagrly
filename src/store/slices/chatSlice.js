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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    unreadCount: 0,
    loading: false,
    error: null,
    selectedChatId: null,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      const chatId = action.payload;
      state.selectedChatId = chatId;

      if (chatId) {
        // When selecting a chat, mark it as read locally (backend handles actual marking)
        const chat = state.chats.find(c => c.id === chatId);
        if (chat && chat.unread_count > 0) {
          state.unreadCount = Math.max(0, state.unreadCount - chat.unread_count);
          chat.unread_count = 0;
        }
      }
    },
    markChatAsRead: (state, action) => {
      const chatId = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat && chat.unread_count > 0) {
        state.unreadCount = Math.max(0, state.unreadCount - chat.unread_count);
        chat.unread_count = 0;
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
        chat.unread_count = (chat.unread_count || 0) + 1;
        state.unreadCount += 1;
      }
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
      state.chats.forEach(chat => {
        chat.unread_count = 0;
      });
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
        const newChats = action.payload;

        // Use backend's unread_count directly
        state.chats = newChats;
        state.unreadCount = newChats.reduce((total, chat) => {
          return total + (chat.unread_count || 0);
        }, 0);
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

export const { setSelectedChat, markChatAsRead, incrementUnreadCount, updateUnreadCounts, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;

