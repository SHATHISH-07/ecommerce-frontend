import { gql } from "@apollo/client";

export const ADD_CATEGORY = gql`
  mutation AddCategory($categoryInput: CategoryInput!) {
    addCategory(categoryInput: $categoryInput) {
      message
      success
      name
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($slug: String!, $categoryInput: UpdateCategoryInput!) {
    updateCategory(slug: $slug, categoryInput: $categoryInput) {
      message
      success
      name
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($slug: String!) {
    removeCategory(slug: $slug) {
      message
      success
      name
    }
  }
`;

export const UPLOAD_BULK_CATEGORIES = gql`
  mutation UploadBulkCategories($file: Upload!) {
    uploadBulkCategoriesJSON(file: $file) {
      success
      message
      total
    }
  }
`;
