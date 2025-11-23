// Personality Quiz Types for Aura Dating App

export type QuestionType = 'single' | 'multi' | 'scale';

export interface QuizOption {
  id: string;
  labelKey: string; // Translation key
  value: string | number;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  titleKey: string; // Translation key for question
  descriptionKey?: string; // Optional description
  options: QuizOption[];
  section: number;
  required: boolean;
  // For multi-select questions
  minSelect?: number;
  maxSelect?: number;
  // For scale questions
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

export interface QuizSection {
  id: number;
  titleKey: string;
  descriptionKey: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  value: string | number | string[];
  timestamp: Date;
}

export interface QuizResult {
  userId: string;
  answers: QuizAnswer[];
  completedAt: Date;
  lieScore: number; // 0-100, higher = more inconsistent answers
  profileEnrichment: ProfileEnrichment;
}

export interface ProfileEnrichment {
  relationshipGoal?: string;
  communicationStyle?: string;
  socialPreference?: string;
  interests?: string[];
  values?: string[];
  dealbreakers?: string[];
  personality?: PersonalityTraits;
}

export interface PersonalityTraits {
  introvertExtrovert: number; // 1-5 scale
  spontaneousPlanned: number;
  traditionalProgressive: number;
  independentIntimate: number;
}

// Control question pairs for lie detection
export interface ControlPair {
  questionId1: string;
  questionId2: string;
  expectedRelation: 'inverse' | 'similar';
  weight: number; // How much inconsistency affects lie score
}

export const CONTROL_PAIRS: ControlPair[] = [
  {
    questionId1: 'social_energy',
    questionId2: 'social_recharge',
    expectedRelation: 'inverse',
    weight: 20
  },
  {
    questionId1: 'honesty_importance',
    questionId2: 'white_lies',
    expectedRelation: 'inverse',
    weight: 25
  },
  {
    questionId1: 'spontaneity',
    questionId2: 'planning_preference',
    expectedRelation: 'inverse',
    weight: 15
  },
  {
    questionId1: 'independence',
    questionId2: 'togetherness',
    expectedRelation: 'inverse',
    weight: 20
  }
];

// Progress milestones for motivation
export const PROGRESS_MILESTONES = {
  first_third: 33,
  two_thirds: 66,
  complete: 100
};

export const MILESTONE_MESSAGES: Record<number, string> = {
  33: 'quiz_milestone_33', // Translation key
  66: 'quiz_milestone_66',
  100: 'quiz_complete'
};

// Calculate lie score based on control pairs
export function calculateLieScore(answers: QuizAnswer[]): number {
  let totalWeight = 0;
  let inconsistencyScore = 0;

  const answerMap = new Map(answers.map(a => [a.questionId, a.value]));

  for (const pair of CONTROL_PAIRS) {
    const val1 = answerMap.get(pair.questionId1);
    const val2 = answerMap.get(pair.questionId2);

    if (val1 !== undefined && val2 !== undefined &&
        typeof val1 === 'number' && typeof val2 === 'number') {
      totalWeight += pair.weight;

      if (pair.expectedRelation === 'inverse') {
        // For inverse, if both are high or both are low, that's inconsistent
        const diff = Math.abs(val1 - (6 - val2)); // Assuming 1-5 scale
        inconsistencyScore += (diff / 4) * pair.weight; // Normalize diff to 0-1
      } else {
        // For similar, if they differ too much, that's inconsistent
        const diff = Math.abs(val1 - val2);
        inconsistencyScore += (diff / 4) * pair.weight;
      }
    }
  }

  return totalWeight > 0 ? Math.round((inconsistencyScore / totalWeight) * 100) : 0;
}
