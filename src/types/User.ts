export interface UserType {
    userId: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}
