import gql from 'graphql-tag';

export const GET_DASHBOARD_UNITS = gql`
  query GetDashboardUnits($elkheta_id: ID) {
    dashboardUnits(elkheta_id: $elkheta_id) {
      id
      slug
      name
      admin_name
      current_capacity
      max_capacity
      educational_sections
      total_groups
      outside_count
      students_expired_at_count
      groups {
        name
        current
        capacity
      }
      education_section {
        subjects {
          id
          name
        }
      }
    }
  }
`;
