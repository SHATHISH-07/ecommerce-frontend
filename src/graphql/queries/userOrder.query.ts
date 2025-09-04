import { gql } from "@apollo/client";

export const GET_USER_ORDERS = gql`
    query GetAllUserOrder {
        getAllUserOrder {
            id
            products {
                externalProductId
                title
                thumbnail
                priceAtPurchase
                quantity
                returnPolicy
                returnExpiresAt
            }
            orderStatus
            paymentMethod
            paymentStatus
            totalAmount
            deliveredAt
        }
}
`

export const GET_USER_ORDER_BY_ID = gql`
   query GetOrderById($orderId: String!){
        getOrderById(orderId: $orderId) {
            id
            products {
                externalProductId
                title
                thumbnail
                priceAtPurchase
                quantity
                returnPolicy
                returnExpiresAt
            }
            orderStatus
            paymentMethod
            paymentStatus
            totalAmount
            deliveredAt
        }
    }
`;

