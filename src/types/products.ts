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

