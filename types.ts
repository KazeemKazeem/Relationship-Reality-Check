
export enum RelationshipCategory {
  ROMANTIC = 'romantic',
  FRIEND = 'friend',
  FAMILY = 'family'
}

export enum AnswerScale {
  STRONGLY_AGREE = 5,
  AGREE = 4,
  NEUTRAL = 3,
  DISAGREE = 2,
  STRONGLY_DISAGREE = 1
}

export interface RelationshipMetadata {
  subtype: string;
  durationMonths: number;
  closenessLevel: number; // 1-10
  livingSituation: string;
}

export interface Question {
  id: string;
  text: string;
  category: string; // The sub-metric (e.g., 'trust', 'communication')
  weight: number;
}

export interface EvaluationResponse {
  questionId: string;
  answerValue: number;
}

export interface CategoryResult {
  name: string;
  score: number; // 0-100
  weight: number;
}

export interface EvaluationResult {
  id: string;
  totalScore: number;
  categoryBreakdown: CategoryResult[];
  timestamp: string;
  relationshipLabel: string;
  relationshipCategory: RelationshipCategory;
  metadata?: RelationshipMetadata;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
}

export interface AppState {
  user: UserProfile | null;
  isGuest: boolean;
  history: EvaluationResult[];
}
