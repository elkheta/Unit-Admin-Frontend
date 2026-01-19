import gql from 'graphql-tag';

export const UNIT_ADMIN_SUBJECT_PART_DETAILS = gql`
  query UnitAdminSubjectPartDetails($student_id: ID!, $subjectId: ID!, $subjectPartId: ID!) {
    unitAdminSubjectPartDetails(student_id: $student_id, subjectId: $subjectId, subjectPartId: $subjectPartId) {
        part_name
        subject_name
        by_course {
          course_name
          teacher_name
          videos {
            name
            duration
            status
          }
          exercises {
            name
            sessions {
              id
              end_date
              score
              time_taken
            }
          }
        }
    }
  }
`;


