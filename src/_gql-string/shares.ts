import { gql } from "@apollo/client";

export const gql_createShare = gql`
  mutation createShare($input: CreateShareInput!) {
    createShare(createShareInput: $input){
      _id
      video_id
      title
      channel
      thumbnail
      description
      created_at
      user {
        _id
        name
        email
      }
    }
  }
`;

export const gql_getShares = gql`
  query getShares($input: PagingInput!) {
    getShares(pagingInput: $input){
      total
      data {
        _id
        video_id
        title
        channel
        thumbnail
        description
        created_at
        user {
          _id
          name
          email
        }
      }
    }
  }
`;
