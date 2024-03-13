import { gql } from "@apollo/client";

export const gql_login = gql`
  mutation login($input: LoginInput!) {
    login(loginInput: $input){
      user {
        _id
        name
        email
      }
      access_token
      refresh_token
    }
  }
`;

export const gql_register = gql`
  mutation register($input: RegistationInput!) {
    register(registrationInput: $input){
      user {
        _id
        name
        email
      }
      access_token
      refresh_token
    }
  }
`;

export const gql_refreshToken = gql`
  mutation refreshToken {
    refreshToken {
        access_token
        user {
          _id
          name
          email
        }
        access_token
        refresh_token
    }
  }
`;