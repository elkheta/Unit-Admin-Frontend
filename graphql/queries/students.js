import gql from 'graphql-tag';

export const GET_UNIT_STUDENTS = gql`
  query GetUnitStudents(
    $slug: String!
    $page: Int
    $search: String
    $group_name: String
    $subject_id: ID
    $diamonds_min: Int
    $diamonds_max: Int
    $progress_min: Int
    $progress_max: Int
    $score_min: Int
    $score_max: Int
    $lessons_min: Int
    $last_seen_after: DateTime
    $last_seen_before: DateTime
    $expired: Boolean
    $orderBy: [OrderByClause!]
  ) {
    unit(slug: $slug) {
      id
      name
      slug
      admin_name

      educational_sections
      groups {
        name
      }
      education_section {
        subjects {
          id
          name
        }
      }
    }
    students(
      unit_slug: $slug
      page: $page
      search: $search
      group_name: $group_name
      subject_id: $subject_id
      diamonds_min: $diamonds_min
      diamonds_max: $diamonds_max
      progress_min: $progress_min
      progress_max: $progress_max
      score_min: $score_min
      score_max: $score_max
      lessons_min: $lessons_min
      last_seen_after: $last_seen_after
      last_seen_before: $last_seen_before
      expired: $expired
      orderBy: $orderBy
    ) {
      data {
        id
        elkheta_id
        name
        phone_number
        points
        diamonds
        last_seen
        current_progress
        accumulated_subject_parts_count
        accumulated_subject_parts_percentage
        group_name
        parent_name
        parent_phone
        added_to_unit_at
        expiration_date
        labels {
          id
          name
          color
        }
      }
      paginatorInfo {
        currentPage
        lastPage
        perPage
        total
        count
      }
    }
  }
`;
