import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signUp($input: SignupInput!) {
    signup(input: $input) {
      message
      success
    }
  }
`;

export const VERIFY_EMAIL_OTP = gql`
  mutation VerifyEmail($email: String!, $otp: String!) {
    verifyEmailOtp(email: $email, otp: $otp) {
      name
      username
      email
    }
  }
`;

export const RESEND_EMAIL_OTP = gql`
  mutation ResendEmailOTP($email: String!) {
    resendEmailOTP(email: $email) {
      success
      message
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginIdentifier: String!, $password: String!) {
    login(loginIdentifier: $loginIdentifier, password: $password) {
      id
      username
      email
      role
      token
    }
  }
`;

