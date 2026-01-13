
import gql from 'graphql-tag';

export const GET_ALL_UNITS = gql`
  query getAllUnits($page: Int!, $first: Int!, $name: String) {
    units(page: $page, first: $first, name: $name) {
      data {
        id
        slug
        name
        admin_name
        admin_phone
        lost_count
        total_groups
        educational_sections
        groups {
          name
          current
          capacity
        }
        outside_count
        students_expired_at_count
        
        # We need these for UnitCard visuals and calculations
        current_capacity
        max_capacity
      }
      paginatorInfo {
        currentPage
        lastPage
        hasMorePages
        total
        perPage
      }
    }
  }
`;
