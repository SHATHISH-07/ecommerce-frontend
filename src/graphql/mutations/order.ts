import { gql } from "@apollo/client";


export const PLACE_ORDER = gql`
    mutation PlaceOrder($input: PlaceOrderInput!){
        placeOrder(input: $input) {
            message
            success
    }
}
`;
export const PLACE_ORDER_FROM_CART = gql`
  mutation placeOrderFromCart(
    $paymentMethod: PaymentMethod!, 
    $shippingAddress: ShippingAddressInput!
  ) {
    placeOrderFromCart(
      paymentMethod: $paymentMethod, 
      shippingAddress: $shippingAddress
    ) {
      success
      message
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: String!, $reason: String!) {
    cancelOrder(orderId: $orderId, reason: $reason) {
      success
      message
    }
  }
`;

export const RETURN_ORDER = gql`
 mutation ReturnOrder($orderId: String!, $reason: String!){
  returnOrder(orderId: $orderId, reason: $reason) {
    message
    success
  }
}
`;

export const UPDATE_USER_ORDER_STATUS = gql`
  mutation UpdateUserOrderStatus($orderId: String!, $newStatus: OrderStatus!) {
    updateUserOrderStatus(orderId: $orderId, newStatus: $newStatus) {
      message
      success
    }
  }
`;

export const INITIATE_REFUND = gql`
mutation InitiateOrConfirmRefundOrder($orderId: String!){
  initiateOrConfirmRefundOrder(orderId: $orderId) {
    message
    success
  }
}
`;