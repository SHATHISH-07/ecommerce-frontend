import { gql } from "@apollo/client";

export const DELETE_PRODUCT = gql`
mutation RemoveProduct($removeProductId: Int!){
  removeProduct(id: $removeProductId) {
    message
    success
  }
}
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      description
      category
      price
      discountPercentage
      rating
      stock
      tags
      brand
      weight
      dimensions {
        width
        height
        depth
      }
      reviews {
        rating
        comment
        date
        reviewerName
        reviewerEmail
      }
      warrantyInformation
      shippingInformation
      availabilityStatus
      returnPolicy
      minimumOrderQuantity
      meta {
        createdAt
        updatedAt
        barcode
        qrCode
      }
      images
      thumbnail
    }
  }
`;

