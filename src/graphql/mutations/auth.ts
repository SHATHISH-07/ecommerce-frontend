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
  mutation VerifyEmailOtp($email: String!, $otp: String!) {
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

export const RESEND_ORDER_OTP = gql`
  mutation ResendOrderOTP($email: String!) {
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

export const VERIFY_EMAIL_UPDATE_OTP = gql`
  mutation VerifyEmailUpdateOtp($email: String!, $otp: String!) {
    verifyEmailUpdateOtp(email: $email, otp: $otp) {
      email
      emailVerified
    }
  }
`;

export const VERIFY_ORDER_OTP = gql`
  mutation verifyOrderOtp($email: String!, $otp: String!) {
    verifyOrderOtp(email: $email, otp: $otp) {
      success
      message
    }
  }
`;

export const INITIATE_RESET_PASSWORD = gql`
mutation InitiateResetPassword($email: String!){
  initiateResetPassword(email: $email) {
    message
    success
  }
}`;

export const RESET_PASSWORD = gql`
mutation ResetPassword($email: String!, $newPassword: String!, $reenterPassword: String!){
  resetPassword(email: $email, newPassword: $newPassword, reenterPassword: $reenterPassword) {
    message
    success
  }
}`;

export const VERIFY_OTP = gql`
  mutation VerifyPasswordResetOTP($email: String!, $otp: String!) {
    verifyPasswordResetOtp(email: $email, otp: $otp) {
      success
      message
    }
  }
`;