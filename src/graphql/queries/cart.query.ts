import { gql } from "@apollo/client";


export const GET_USER_CART_COUNT = gql`
    query GetUserCart {
        getUserCart {
        totalItems
        }
    }
`;

export const GET_USER_CART = gql`
    query GetUserCart {
        getUserCart {
            id
            userId
            products {
                productId
                quantity
            }
            totalItems
        }
    }
`

export const UPDATED_USER_CART_QUANTITY = gql`
    mutation updateUserCart($productId: Int!, $quantity: Int!){
        updateUserCart(productId: $productId, quantity: $quantity) {
            message
            success
    }
}
`;