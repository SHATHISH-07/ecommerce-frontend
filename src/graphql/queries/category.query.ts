import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
query GetAllCategory{
    getCategories {
    name
    slug
    thumbnail
  }
}`

export const SEARCH_CATEGORY_BY_SLUG = gql`
  query searchByCategory($categorySlug: String!) {
    searchByCategory(categorySlug: $categorySlug) {
      name
      slug
      thumbnail
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categorySlug: String!) {
    getProductsByCategory(categorySlug: $categorySlug) {
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
    }
  }
`;