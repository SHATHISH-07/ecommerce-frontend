import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      userId
      name
      username
      email
      phone
      emailVerified
      userOrderHistory{
        orderId
        placedAt
      }
      address
      country
      state
      city
      zipCode
      role
      isActive
      isBanned
      createdAt
      updatedAt
    }
  }
`;



