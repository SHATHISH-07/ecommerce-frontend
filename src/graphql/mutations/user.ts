import { gql } from "@apollo/client";


export const UPDATE_USER_ADDRESS = gql`
    mutation updateUserProfile($input:UpdateUserProfileInput!){
        updateUserProfile(input:$input) {
            address
    }
}`;


export const UPDATE_USER_DETAILS = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      name
      username
      address
      phone
      country
      state
      city
      zipCode
    }
  }
`;

export const UPDATE_USER_EMAIL = gql`
    mutation updateUserEmail($input: UpdateUserEmailInput!) {
        updateUserEmail(input: $input) {
            email
        }
    }
`;

export const UPDATE_USER_PASSWORD = gql`
    mutation UpdatePassword($currentPassword: String!, $newPassword: String!){
        updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
          message
          success
      }
    }
`;

export const DELETE_ACCOUNT = gql`
mutation DeleteAccount($email: String!, $password: String!){
  deleteAccount(email: $email, password: $password) {
    message
    success
  }
}
`;

export const ACTIVATE_USER = gql`
mutation ActivateUser($userId: ID!){
  activateUser(userId: $userId) {
    userId
    name
    username
    email
    isActive
    role
  }
}
`;

export const DEACTIVATE_USER = gql`
mutation($userId: ID!){
  deactivateUser(userId: $userId) {
    userId
    name
    username
    email
    isActive
    role
  }
}
`;

export const BAN_USER = gql`
mutation($userId: ID!){
  banUser(userId: $userId) {
    userId
    name
    username
    email
    isBanned
    role
  }
}
`;