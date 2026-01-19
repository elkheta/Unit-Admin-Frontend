import gql from 'graphql-tag';

export const UNIT_ADMIN_SCHEDULE_WEEKS = gql`
  query UnitAdminScheduleWeeks($student_id: ID!) {
    unitAdminScheduleWeeks(student_id: $student_id) {
      weekNumber
      startDateFormatted
      endDateFormatted
      isCurrentWeek
      progress
      accumulated_subject_parts_count
      days {
        weekDayId
        name
        date
        isHoliday
        subject_parts {
          subject_id
          subject_name
          difficulty_level
          part_id
          part_name
          progress
        }
      }
    }
  }
`;


