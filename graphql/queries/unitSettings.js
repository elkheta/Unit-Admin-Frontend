import { gql } from '@apollo/client/core';

export const GET_UNIT_SETTINGS = gql`
  query GetUnitSettings($slug: String!) {
    unit(slug: $slug) {
      id
      slug
      name
      adminName: admin_name
      supervisors
      currentCapacity: current_capacity
      maxCapacity: max_capacity
      totalGroups: total_groups
      educationalSections: educational_sections
      products {
        name
        status
      }
    }
  }
`;
