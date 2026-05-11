/* eslint react-refresh/only-export-components: "off" */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // 🔹 Add toast
    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();

        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 3s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div style={styles.container}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            ...styles.toast,
                            ...styles[toast.type],
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

/* ================= STYLES ================= */

const styles = {
    container: {
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
    },

    toast: {
        padding: "12px 16px",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "14px",
        minWidth: "220px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
        animation: "slideIn 0.3s ease",
    },

    success: {
        background: "#22c55e",
    },

    error: {
        background: "#ef4444",
    },

    info: {
        background: "#38bdf8",
    },
};