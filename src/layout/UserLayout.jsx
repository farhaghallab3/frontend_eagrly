import React, { useEffect } from "react";
import Header from "@components/common/layout/Header/Header";
import Footer from "@components/common/layout/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import ChatbotWidget from "@components/ecommerce/chatbot/ChatbotWidget";

export default function UserLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <main style={{
                marginTop: "80px",
                padding: "0",
                minHeight: "calc(100vh - 160px)"
            }}>
                <Outlet />
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    );
}
