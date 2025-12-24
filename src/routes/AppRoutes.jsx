import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "@pages/Home/Home";
import AboutUs from "@pages/AboutUs/AboutUs";
import Login from "@pages/Login/Login";
import Register from "@pages/Register/Register";
import ProductsPage from "@pages/MarketPlace/ProductsPage";
import CategoryProductsPage from "@pages/CategoryProducts/CategoryProductsPage";
import ChatApp from "@pages/Chat/ChatApp";
import UserLayout from "../layout/UserLayout";
import NotFound from "@pages/NotFound";
import MyAds from "@pages/MyAds/MyAds";
import ProductDetails from "@pages/ProductDetails/ProductDetails";
import ProfilePage from "@pages/Profile/ProfilePage";
import CheckoutPage from "@pages/Checkout/CheckoutPage";
import PaymentStatusPage from "@pages/Payment/PaymentStatusPage";
import HelpCenter from "@pages/Support/HelpCenter";
import ContactUs from "@pages/Support/ContactUs";
import FAQ from "@pages/Support/FAQ";
import PrivacyPolicy from "@pages/Support/PrivacyPolicy";
import TermsOfService from "@pages/Support/TermsOfService";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* ---------------- Public Layout ---------------- */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<ProductsPage />} />
                    <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={<ChatApp />} />
                    <Route path="/chat/:chatId" element={<ChatApp />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment-status" element={<PaymentStatusPage />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/report" element={<ContactUs />} />
                    <Route path="/my-ads" element={<MyAds />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* ---------------- User Dashboard Layout ---------------- */}
                <Route path="/dashboard" element={<UserLayout />}>
                    <Route index element={<MyAds />} />
                    <Route path="profile" element={<ProfilePage />} />
                    {/* <Route path="profile" element={<ProfilePage />} /> */}
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
