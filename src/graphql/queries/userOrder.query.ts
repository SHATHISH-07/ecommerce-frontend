import { gql } from "@apollo/client";

export const GET_USER_ORDERS = gql`
    query GetAllUserOrder {
        getAllUserOrder {
            id
            products {
                title
                thumbnail
                priceAtPurchase
                quantity
            }
            orderStatus
            paymentMethod
            paymentStatus
            totalAmount
        }
}
`

