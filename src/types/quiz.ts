export type QuizDifficulty = 'mudah' | 'sedang' | 'sulit';

export type QuizCategory = 'semua' | 'aqidah' | 'ibadah' | 'quran' | 'sirah' | 'akhlak';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  sourceOrDalil?: string;
  difficulty: QuizDifficulty;
  category: 'aqidah' | 'ibadah' | 'quran' | 'sirah' | 'akhlak';
}

export interface QuizSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpentSeconds: number;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  date: string;
  answersHistory: {
    questionId: string;
    question: string;
    options: [string, string, string, string];
    selectedOptionIndex: number | null;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
    sourceOrDalil?: string;
  }[];
}

export interface QuizUserStats {
  totalQuizzesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  highestScore: number;
  streakDays: number;
  lastPlayedDate?: string;
  history: {
    id: string;
    date: string;
    score: number;
    accuracy: number;
    difficulty: QuizDifficulty;
    category: QuizCategory;
  }[];
}
