import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($limit: Int, $skip: Int) {
    getAllProducts(limit: $limit, skip: $skip) {
      products {
        id
        title
        description
        category
        price
        discountPercentage
        rating
        warrantyInformation  
        availabilityStatus
        returnPolicy
        thumbnail
      }
      total
      skip
      limit
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $limit: Int, $skip: Int) {
    searchProducts(query: $query, limit: $limit, skip: $skip) {
      products {
        id
        title
        description
        category
        price
        discountPercentage
        rating
        warrantyInformation  
        availabilityStatus
        returnPolicy
        thumbnail
      }
      total
      skip
      limit
    }
  }
`;

export const GET_PRODUCT_BY_ID_SIDE_CART_SHOW = gql`
  query GetProductById($id: Int!) {
    getProductById(id: $id) {
        id
        title
        category
        price
        discountPercentage
        rating 
        availabilityStatus
        returnPolicy
        thumbnail
    }
  }
`;


export const GET_PRODUCT_BY_ID = gql`
query GetProductById($id: Int!) {
    getProductById(id: $id) {
        id
        title
        description
        category
        price
        discountPercentage
        rating
        warrantyInformation  
        availabilityStatus
        returnPolicy
        thumbnail
    }
  }
`