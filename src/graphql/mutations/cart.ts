import { gql } from "@apollo/client";


export const ADD_TO_CART = gql`
    mutation addToCart($input: AddToCartInput!){
        addToCart(input: $input) {
            message
            success
    }
}
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($productId: Int!) {
    removeCartItem(productId: $productId) {
      success
      message
    }
  }
`;

export const CLEAR_CART = gql`
mutation ClearCartItems{
  clearCartItems {
    message
    success
  }
}
`;
