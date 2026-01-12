import { gql } from '@apollo/client/core';

export const GET_STUDENT_PROFILE = gql`
  query GetStudentProfile($studentId: ID!) {
    studentProfile(student_id: $studentId) {
      personal_information {
        first_name
        last_name
        phone_numbers {
          phone_number
          is_whatsapp
        }
        names
        special_note
        email
      }
      more_data {
        governorate
        hobbies {
          id
          name
          selected
        }
        weakest_subjects {
          id
          name
          selected
        }
        preferred_subjects {
          id
          name
          selected
        }
        labels {
          id
          name
          selected
        }
      }
      parent_info {
        parents {
          name
          phone_number
          is_whatsapp
        }
        parent_note
      }
      educational_information {
        education_section {
          id
          name
        }
        second_language
        religion_language
      }
      technical_information {
        last_seen
        since_when
      }
      orders {
        count
        status
        expires_at
        orders {
          number
          paid_at
          status
          price
          expires_at {
            date
            left
          }
        }
      }
    }
  }
`;


