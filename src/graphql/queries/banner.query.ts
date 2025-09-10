import { gql } from "@apollo/client";


export const GET_ALL_BANNERS = gql`
query GetAllBanners{
  getAllBanners {
    imageUrl
    isActive
    description
    title
    createdAt
    id
  }
}`;

export const GET_BANNER_BY_ID = gql`
query($id: String!){
  getBannerById(id: $id) {
    imageUrl
    isActive
    description
    title
    createdAt
    id
  }
}
`;