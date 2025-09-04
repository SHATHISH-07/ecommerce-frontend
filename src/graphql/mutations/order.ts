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