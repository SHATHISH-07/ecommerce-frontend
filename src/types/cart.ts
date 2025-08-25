export interface UserCart {
    userId: string;
    products: {
        productId: number;
        quantity: number;
        createdAt: Date;
        updatedAt: Date | null;
    }[];
    totalItems: number;
    maxLimit: number;
}