import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from './slices/productSlice';
import categoryReducer from './slices/CategorySlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import wishlistReducer from './slices/wishlistSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        chat: chatReducer,
        notifications: notificationReducer,
        wishlist: wishlistReducer,
    },
});
