import Footer from "@components/common/layout/Footer/Footer";
import Header from "@components/common/layout/Header/Header";
import React from "react";
// import Footer from "./Footer/Footer";
import { Outlet } from 'react-router-dom';
import ChatbotWidget from "@components/ecommerce/chatbot/ChatbotWidget";

export default function Layout() {
    return (
        <>
            <Header />
            <main style={{ margin: "auto" }}>
                <Outlet />
            </main>
            <Footer />
            <ChatbotWidget />

        </>
    );
}
