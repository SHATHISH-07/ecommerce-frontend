export interface UserType {
    userId: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    userOrderHistory?: UserOrderHistory[];
    city?: string;
    zipCode?: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}


interface UserOrderHistory {
    orderId: string;
    placedAt: string;
}