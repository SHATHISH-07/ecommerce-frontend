import { ShoppingCart } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export const useAppToast = () => {
    const toastCartSuccess = (message: string = "Item added to cart!") => {
        toast.success(message, {
            duration: 3000,
            position: "bottom-left",
            style: {
                background: "linear-gradient(to right, #c9812f, #3b82f6)",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontWeight: "500",
            },
            icon: React.createElement(ShoppingCart, { size: 18 }),
        });
    };

    const toastSuccess = (message: string) => {
        toast.success(message, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "linear-gradient(to right, #c9812f, #3b82f6)",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontWeight: "500",
            },
        });
    };

    const toastError = (message: string) => {
        toast.error(message, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "#dc2626",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontWeight: "500",
            },
        });
    };

    return { toastCartSuccess, toastSuccess, toastError };
};
