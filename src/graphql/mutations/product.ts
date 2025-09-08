import { gql } from "@apollo/client";

export const DELETE_PRODUCT = gql`
mutation RemoveProduct($removeProductId: Int!){
  removeProduct(id: $removeProductId) {
    message
    success
  }
}
`;