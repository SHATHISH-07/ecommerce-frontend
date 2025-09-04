export type PaymentMethod = "Cash_on_Delivery" | "Card" | "UPI" | "NetBanking";

export interface ShippingAddress {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isVerified: boolean;
}

export interface PlaceOrderFromCartResponse {
    placeOrderFromCart: {
        success: boolean;
        message?: string;
    };
}

export interface CancelOrderResponse {
    cancelOrder: {
        success: boolean;
        message: string;
    };
}
