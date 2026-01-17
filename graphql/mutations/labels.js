import { gql } from '@apollo/client/core';

export const CREATE_LABEL = gql`
  mutation CreateLabel($input: LabelInput!) {
    createLabel(input: $input) {
      id
      name
      description
      color
      category {
        id
        name
      }
      creator {
        id
        name
      }
      created_at
    }
  }
`;

export const UPDATE_LABEL = gql`
  mutation UpdateLabel($id: ID!, $input: LabelInput!) {
    updateLabel(id: $id, input: $input) {
      id
      name
      description
      color
      category {
        id
        name
      }
      updated_at
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      id
    }
  }
`;
