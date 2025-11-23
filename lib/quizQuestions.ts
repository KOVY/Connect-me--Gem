// Personality Quiz Questions for Aura Dating App
// 25 questions across 5 sections with control questions for lie detection

import { QuizQuestion, QuizSection } from './quizTypes';

// Section 1: Basic Preferences (5 questions)
const section1Questions: QuizQuestion[] = [
  {
    id: 'relationship_goal',
    type: 'single',
    titleKey: 'quiz_q_relationship_goal',
    descriptionKey: 'quiz_q_relationship_goal_desc',
    section: 1,
    required: true,
    options: [
      { id: 'casual', labelKey: 'quiz_opt_casual_dating', value: 'casual' },
      { id: 'serious', labelKey: 'quiz_opt_serious_relationship', value: 'serious' },
      { id: 'friendship', labelKey: 'quiz_opt_friendship_first', value: 'friendship' },
      { id: 'open', labelKey: 'quiz_opt_open_to_anything', value: 'open' }
    ]
  },
  {
    id: 'communication_style',
    type: 'single',
    titleKey: 'quiz_q_communication_style',
    section: 1,
    required: true,
    options: [
      { id: 'frequent', labelKey: 'quiz_opt_frequent_texter', value: 'frequent' },
      { id: 'occasional', labelKey: 'quiz_opt_occasional_check_in', value: 'occasional' },
      { id: 'calls', labelKey: 'quiz_opt_prefer_calls', value: 'calls' },
      { id: 'person', labelKey: 'quiz_opt_prefer_in_person', value: 'person' }
    ]
  },
  {
    id: 'ideal_first_date',
    type: 'single',
    titleKey: 'quiz_q_ideal_first_date',
    section: 1,
    required: true,
    options: [
      { id: 'coffee', labelKey: 'quiz_opt_coffee_casual', value: 'coffee' },
      { id: 'dinner', labelKey: 'quiz_opt_dinner_romantic', value: 'dinner' },
      { id: 'activity', labelKey: 'quiz_opt_activity_adventure', value: 'activity' },
      { id: 'cultural', labelKey: 'quiz_opt_cultural_event', value: 'cultural' }
    ]
  },
  {
    id: 'distance_preference',
    type: 'single',
    titleKey: 'quiz_q_distance_preference',
    section: 1,
    required: true,
    options: [
      { id: 'local', labelKey: 'quiz_opt_same_city', value: 'local' },
      { id: 'regional', labelKey: 'quiz_opt_within_hour', value: 'regional' },
      { id: 'national', labelKey: 'quiz_opt_same_country', value: 'national' },
      { id: 'anywhere', labelKey: 'quiz_opt_distance_no_matter', value: 'anywhere' }
    ]
  },
  {
    id: 'age_preference',
    type: 'single',
    titleKey: 'quiz_q_age_preference',
    section: 1,
    required: true,
    options: [
      { id: 'similar', labelKey: 'quiz_opt_similar_age', value: 'similar' },
      { id: 'younger', labelKey: 'quiz_opt_prefer_younger', value: 'younger' },
      { id: 'older', labelKey: 'quiz_opt_prefer_older', value: 'older' },
      { id: 'no_preference', labelKey: 'quiz_opt_age_no_preference', value: 'no_preference' }
    ]
  }
];

// Section 2: Personality & Social (6 questions including control)
const section2Questions: QuizQuestion[] = [
  {
    id: 'social_energy',
    type: 'scale',
    titleKey: 'quiz_q_social_energy',
    descriptionKey: 'quiz_q_social_energy_desc',
    section: 2,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_introvert',
    scaleMaxLabel: 'quiz_scale_extrovert'
  },
  {
    id: 'social_recharge',
    type: 'scale',
    titleKey: 'quiz_q_social_recharge',
    descriptionKey: 'quiz_q_social_recharge_desc',
    section: 2,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_need_alone_time',
    scaleMaxLabel: 'quiz_scale_energized_by_people'
  },
  {
    id: 'spontaneity',
    type: 'scale',
    titleKey: 'quiz_q_spontaneity',
    section: 2,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_love_routine',
    scaleMaxLabel: 'quiz_scale_love_surprises'
  },
  {
    id: 'planning_preference',
    type: 'scale',
    titleKey: 'quiz_q_planning_preference',
    descriptionKey: 'quiz_q_planning_preference_desc',
    section: 2,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_go_with_flow',
    scaleMaxLabel: 'quiz_scale_plan_everything'
  },
  {
    id: 'conflict_style',
    type: 'single',
    titleKey: 'quiz_q_conflict_style',
    section: 2,
    required: true,
    options: [
      { id: 'discuss', labelKey: 'quiz_opt_discuss_immediately', value: 'discuss' },
      { id: 'cool_off', labelKey: 'quiz_opt_cool_off_first', value: 'cool_off' },
      { id: 'avoid', labelKey: 'quiz_opt_avoid_conflict', value: 'avoid' },
      { id: 'compromise', labelKey: 'quiz_opt_seek_compromise', value: 'compromise' }
    ]
  },
  {
    id: 'emotional_expression',
    type: 'scale',
    titleKey: 'quiz_q_emotional_expression',
    section: 2,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_private',
    scaleMaxLabel: 'quiz_scale_open_book'
  }
];

// Section 3: Values & Relationships (5 questions)
const section3Questions: QuizQuestion[] = [
  {
    id: 'honesty_importance',
    type: 'scale',
    titleKey: 'quiz_q_honesty_importance',
    descriptionKey: 'quiz_q_honesty_importance_desc',
    section: 3,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_sometimes_ok',
    scaleMaxLabel: 'quiz_scale_always_truth'
  },
  {
    id: 'white_lies',
    type: 'scale',
    titleKey: 'quiz_q_white_lies',
    descriptionKey: 'quiz_q_white_lies_desc',
    section: 3,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_never_lie',
    scaleMaxLabel: 'quiz_scale_white_lies_ok'
  },
  {
    id: 'independence',
    type: 'scale',
    titleKey: 'quiz_q_independence',
    section: 3,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_together_always',
    scaleMaxLabel: 'quiz_scale_need_space'
  },
  {
    id: 'togetherness',
    type: 'scale',
    titleKey: 'quiz_q_togetherness',
    descriptionKey: 'quiz_q_togetherness_desc',
    section: 3,
    required: true,
    options: [],
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'quiz_scale_separate_lives',
    scaleMaxLabel: 'quiz_scale_share_everything'
  },
  {
    id: 'family_importance',
    type: 'single',
    titleKey: 'quiz_q_family_importance',
    section: 3,
    required: true,
    options: [
      { id: 'very', labelKey: 'quiz_opt_family_very_important', value: 'very' },
      { id: 'somewhat', labelKey: 'quiz_opt_family_somewhat', value: 'somewhat' },
      { id: 'independent', labelKey: 'quiz_opt_family_independent', value: 'independent' },
      { id: 'complicated', labelKey: 'quiz_opt_family_complicated', value: 'complicated' }
    ]
  }
];

// Section 4: Interests & Lifestyle (5 questions with multi-select)
const section4Questions: QuizQuestion[] = [
  {
    id: 'hobbies',
    type: 'multi',
    titleKey: 'quiz_q_hobbies',
    descriptionKey: 'quiz_q_hobbies_desc',
    section: 4,
    required: true,
    minSelect: 2,
    maxSelect: 5,
    options: [
      { id: 'sports', labelKey: 'quiz_opt_sports_fitness', value: 'sports' },
      { id: 'arts', labelKey: 'quiz_opt_arts_creative', value: 'arts' },
      { id: 'music', labelKey: 'quiz_opt_music', value: 'music' },
      { id: 'travel', labelKey: 'quiz_opt_travel', value: 'travel' },
      { id: 'cooking', labelKey: 'quiz_opt_cooking_food', value: 'cooking' },
      { id: 'reading', labelKey: 'quiz_opt_reading_learning', value: 'reading' },
      { id: 'gaming', labelKey: 'quiz_opt_gaming', value: 'gaming' },
      { id: 'nature', labelKey: 'quiz_opt_nature_outdoors', value: 'nature' },
      { id: 'tech', labelKey: 'quiz_opt_tech', value: 'tech' },
      { id: 'social', labelKey: 'quiz_opt_socializing', value: 'social' }
    ]
  },
  {
    id: 'weekend_preference',
    type: 'single',
    titleKey: 'quiz_q_weekend_preference',
    section: 4,
    required: true,
    options: [
      { id: 'adventure', labelKey: 'quiz_opt_adventure_explore', value: 'adventure' },
      { id: 'relax', labelKey: 'quiz_opt_relax_recharge', value: 'relax' },
      { id: 'social', labelKey: 'quiz_opt_social_events', value: 'social' },
      { id: 'productive', labelKey: 'quiz_opt_productive_projects', value: 'productive' },
      { id: 'mix', labelKey: 'quiz_opt_mix_of_both', value: 'mix' }
    ]
  },
  {
    id: 'fitness_level',
    type: 'single',
    titleKey: 'quiz_q_fitness_level',
    section: 4,
    required: true,
    options: [
      { id: 'athlete', labelKey: 'quiz_opt_very_active', value: 'athlete' },
      { id: 'regular', labelKey: 'quiz_opt_regular_exercise', value: 'regular' },
      { id: 'casual', labelKey: 'quiz_opt_casual_active', value: 'casual' },
      { id: 'minimal', labelKey: 'quiz_opt_prefer_relaxing', value: 'minimal' }
    ]
  },
  {
    id: 'social_media_use',
    type: 'single',
    titleKey: 'quiz_q_social_media',
    section: 4,
    required: true,
    options: [
      { id: 'heavy', labelKey: 'quiz_opt_social_heavy', value: 'heavy' },
      { id: 'moderate', labelKey: 'quiz_opt_social_moderate', value: 'moderate' },
      { id: 'minimal', labelKey: 'quiz_opt_social_minimal', value: 'minimal' },
      { id: 'none', labelKey: 'quiz_opt_social_none', value: 'none' }
    ]
  },
  {
    id: 'lifestyle_values',
    type: 'multi',
    titleKey: 'quiz_q_lifestyle_values',
    descriptionKey: 'quiz_q_lifestyle_values_desc',
    section: 4,
    required: true,
    minSelect: 2,
    maxSelect: 4,
    options: [
      { id: 'career', labelKey: 'quiz_opt_career_success', value: 'career' },
      { id: 'family', labelKey: 'quiz_opt_family_home', value: 'family' },
      { id: 'adventure', labelKey: 'quiz_opt_adventure_experiences', value: 'adventure' },
      { id: 'stability', labelKey: 'quiz_opt_stability_security', value: 'stability' },
      { id: 'creativity', labelKey: 'quiz_opt_creativity_expression', value: 'creativity' },
      { id: 'health', labelKey: 'quiz_opt_health_wellness', value: 'health' },
      { id: 'spirituality', labelKey: 'quiz_opt_spirituality', value: 'spirituality' },
      { id: 'wealth', labelKey: 'quiz_opt_wealth_comfort', value: 'wealth' }
    ]
  }
];

// Section 5: Deal-breakers (4 questions)
const section5Questions: QuizQuestion[] = [
  {
    id: 'smoking_preference',
    type: 'single',
    titleKey: 'quiz_q_smoking',
    section: 5,
    required: true,
    options: [
      { id: 'never', labelKey: 'quiz_opt_no_smokers', value: 'never' },
      { id: 'occasional_ok', labelKey: 'quiz_opt_occasional_ok', value: 'occasional_ok' },
      { id: 'no_preference', labelKey: 'quiz_opt_doesnt_matter', value: 'no_preference' },
      { id: 'smoker', labelKey: 'quiz_opt_i_smoke', value: 'smoker' }
    ]
  },
  {
    id: 'drinking_preference',
    type: 'single',
    titleKey: 'quiz_q_drinking',
    section: 5,
    required: true,
    options: [
      { id: 'never', labelKey: 'quiz_opt_no_drinkers', value: 'never' },
      { id: 'social', labelKey: 'quiz_opt_social_drinking', value: 'social' },
      { id: 'regular', labelKey: 'quiz_opt_enjoy_drinks', value: 'regular' },
      { id: 'no_preference', labelKey: 'quiz_opt_doesnt_matter', value: 'no_preference' }
    ]
  },
  {
    id: 'children_preference',
    type: 'single',
    titleKey: 'quiz_q_children',
    section: 5,
    required: true,
    options: [
      { id: 'want', labelKey: 'quiz_opt_want_children', value: 'want' },
      { id: 'have', labelKey: 'quiz_opt_have_children', value: 'have' },
      { id: 'dont_want', labelKey: 'quiz_opt_dont_want_children', value: 'dont_want' },
      { id: 'unsure', labelKey: 'quiz_opt_unsure_children', value: 'unsure' }
    ]
  },
  {
    id: 'dealbreakers_multi',
    type: 'multi',
    titleKey: 'quiz_q_dealbreakers',
    descriptionKey: 'quiz_q_dealbreakers_desc',
    section: 5,
    required: false,
    minSelect: 0,
    maxSelect: 5,
    options: [
      { id: 'dishonesty', labelKey: 'quiz_opt_db_dishonesty', value: 'dishonesty' },
      { id: 'no_ambition', labelKey: 'quiz_opt_db_no_ambition', value: 'no_ambition' },
      { id: 'bad_hygiene', labelKey: 'quiz_opt_db_hygiene', value: 'bad_hygiene' },
      { id: 'rudeness', labelKey: 'quiz_opt_db_rudeness', value: 'rudeness' },
      { id: 'jealousy', labelKey: 'quiz_opt_db_jealousy', value: 'jealousy' },
      { id: 'no_humor', labelKey: 'quiz_opt_db_no_humor', value: 'no_humor' },
      { id: 'political', labelKey: 'quiz_opt_db_political', value: 'political' },
      { id: 'pets', labelKey: 'quiz_opt_db_no_pets', value: 'pets' }
    ]
  }
];

// Combine all sections
export const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: 1,
    titleKey: 'quiz_section_1_title',
    descriptionKey: 'quiz_section_1_desc',
    questions: section1Questions
  },
  {
    id: 2,
    titleKey: 'quiz_section_2_title',
    descriptionKey: 'quiz_section_2_desc',
    questions: section2Questions
  },
  {
    id: 3,
    titleKey: 'quiz_section_3_title',
    descriptionKey: 'quiz_section_3_desc',
    questions: section3Questions
  },
  {
    id: 4,
    titleKey: 'quiz_section_4_title',
    descriptionKey: 'quiz_section_4_desc',
    questions: section4Questions
  },
  {
    id: 5,
    titleKey: 'quiz_section_5_title',
    descriptionKey: 'quiz_section_5_desc',
    questions: section5Questions
  }
];

// Get all questions flat
export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = QUIZ_SECTIONS.flatMap(s => s.questions);

// Total questions count
export const TOTAL_QUESTIONS = ALL_QUIZ_QUESTIONS.length;
