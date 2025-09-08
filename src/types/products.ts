export interface Product {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    brand: string;
    warrantyInformation: string;
    availabilityStatus: string;
    returnPolicy: string;
    thumbnail: string;
}


export interface SearchProduct {
    id: string;
    title: string;
    price: number;
    rating: number;
}

// src/types/product.ts

export interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

export interface Meta {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
}

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
}

export interface DetailedProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: Dimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: Meta;
    images: string[];
    thumbnail: string;
    reviews?: Review[];
}

