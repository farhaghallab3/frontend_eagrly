import Footer from "@components/common/layout/Footer/Footer";
import Header from "@components/common/layout/Header/Header";
import React from "react";
import { Outlet, useLocation } from 'react-router-dom';
import ChatbotWidget from "@components/ecommerce/chatbot/ChatbotWidget";

export default function Layout() {
    const location = useLocation();
    const isChatPage = location.pathname.startsWith('/chat');

    return (
        <>
            <Header />
            <main style={{ margin: "auto" }}>
                <Outlet />
            </main>
            {!isChatPage && <Footer />}
            <ChatbotWidget />
        </>
    );
}
