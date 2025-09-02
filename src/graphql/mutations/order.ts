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
