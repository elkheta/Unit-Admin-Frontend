import { gql } from '@apollo/client/core';

export const GET_ALL_LABELS = gql`
  query GetAllLabels(
    $first: Int = 10
    $page: Int
    $name: String
    $label_category_id: ID
  ) {
    labels(
      first: $first
      page: $page
      name: $name
      label_category_id: $label_category_id
    ) {
      data {
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
        updated_at
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`;

export const GET_LABEL_CATEGORIES = gql`
  query GetLabelCategories {
    labelCategories {
      id
      name
    }
  }
`;

export const GET_LABEL = gql`
  query GetLabel($id: ID!) {
    label(id: $id) {
      id
      name
      description
      color
      category {
        id
        name
      }
      created_at
      updated_at
    }
  }
`;
