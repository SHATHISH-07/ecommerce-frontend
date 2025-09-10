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


export const GET_USER = gql`
query GetUser($userId:String,$username:String,$email:String){
  getUser(userId:$userId,username: $username,email:$email) {
    userId
    name
    username
    role
    email
    isActive
    isBanned
  }
}
`;

export const GET_USERS = gql`
query GetAllUsers{
  getUsers {
    userId
    name
    username
    role
    email
    isActive
    isBanned
  }
}
`;


