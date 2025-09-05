import { gql } from "@apollo/client";


export const GET_ALL_BANNERS = gql`
query GetAllBanners{
  getAllBanners {
    imageUrl
    id
  }
}`;