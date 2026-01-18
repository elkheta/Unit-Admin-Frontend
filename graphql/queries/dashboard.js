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
      reminders_count
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

export const GET_DASHBOARD_REMINDERS = gql`
  query GetDashboardReminders {
    dashboardReminders {
      id
      text
      due_date
      status
      student {
        id
        name
        group_name
        unit {
          name
          slug
        }
      }
    }
  }
`;

export const UPDATE_STUDENT_NOTE = gql`
  mutation UpdateStudentNote($id: ID!, $input: UpdateStudentNoteInput!) {
    updateStudentNote(id: $id, input: $input) {
      id
      status
    }
  }
`;

export const DELETE_STUDENT_NOTE = gql`
  mutation DeleteStudentNote($id: ID!) {
    deleteStudentNote(id: $id) {
      id
    }
  }
`;
