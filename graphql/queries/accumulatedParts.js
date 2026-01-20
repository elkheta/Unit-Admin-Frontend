import gql from 'graphql-tag';

export const GET_ACCUMULATED_PARTS = gql`
  query GetAccumulatedParts($elkheta_id: ID!) {
    unitAdminAccumulatedParts(elkheta_id: $elkheta_id) {
      subject_name
      part_name
      progress
      created_at
    }
  }
`;
