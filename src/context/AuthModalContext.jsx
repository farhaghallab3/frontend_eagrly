import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openAuthModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <AuthModalContext.Provider value={{ isOpen, openAuthModal, closeAuthModal }}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};
