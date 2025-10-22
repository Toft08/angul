export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  data: any;
  answer: any;
  completed: boolean;
}

export enum ChallengeType {
  IMAGE_SELECTION = 'image_selection',
  MATH_PROBLEM = 'math_problem',
  TEXT_INPUT = 'text_input'
}

export interface ImageSelectionData {
  images: ImageItem[];
  target: string; // What to select (e.g., "cars", "traffic lights")
  gridSize: number; // 3x3, 4x4 etc.
}

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  isTarget: boolean;
}

export interface MathProblemData {
  question: string;
  answer: number;
}

export interface TextInputData {
  prompt: string;
  expectedText: string;
  caseSensitive: boolean;
}

export interface UserProgress {
  currentChallengeIndex: number;
  completedChallenges: string[];
  startTime: Date;
  endTime?: Date;
  score: number;
  totalAttempts: number;
  challengeSetId?: number; // Track which challenge set is being used
  sessionId?: string; // Unique session identifier
}

export interface ChallengeResult {
  challengeId: string;
  userAnswer: any;
  isCorrect: boolean;
  timeSpent: number;
  attemptNumber: number; // Track which attempt this was for this challenge
}

export interface ChallengeAttempts {
  challengeId: string;
  attempts: ChallengeResult[];
  isCompleted: boolean;
  successfulAttempt?: ChallengeResult;
}