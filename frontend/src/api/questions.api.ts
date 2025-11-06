import { MOCK_QUESTIONS } from '../utils/constants';
import type { Question } from '../types';

// API functions for fetching questions
export const fetchQuestions = async (): Promise<Question[]> => {
  // In a real app, this would be an API call
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_QUESTIONS);
    }, 500);
  });
};

export const submitAssessment = async (_answers: Record<number, number>): Promise<{ success: boolean; message: string }> => {
  // In a real app, this would submit to backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Assessment submitted successfully' });
    }, 1000);
  });
};

