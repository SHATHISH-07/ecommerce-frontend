import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
mutation AddBanner($title:String, $description:String,$imageUrl: String!){
  addBanner(title: $title,description:$description,imageUrl: $imageUrl) {
    title
    imageUrl
    isActive
    description
    createdAt
  }
}
`;

export const UPDATE_BANNER = gql`
  mutation UpdateBanner(
    $id: ID!
    $imageUrl: String
    $title: String
    $description: String
    $isActive: Boolean
  ) {
    updateBanner(
      id: $id
      imageUrl: $imageUrl
      title: $title
      description: $description
      isActive: $isActive
    ) {
      id
      imageUrl
      title
      description
      isActive
      createdAt
    }
  }
`;

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id)
  }
`;
