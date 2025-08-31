import { gql } from "@apollo/client";


export const UPDATE_USER_ADDRESS = gql`
    mutation updateUserProfile($input:UpdateUserProfileInput!){
        updateUserProfile(input:$input) {
            address
    }
}`


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
`

