import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchQuestions } from '../api/questions.api';
import { QUESTION_STATUS, TIMER_DURATION } from '../utils/constants';
import type { MCQContextType, Question } from '../types';

const MCQContext = createContext<MCQContextType | undefined>(undefined);

interface MCQProviderProps {
  children: ReactNode;
}

export const MCQProvider = ({ children }: MCQProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isLoading, setIsLoading] = useState(true);

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
        // Initialize statuses
        const initialStatuses: Record<number, string> = {};
        data.forEach((q) => {
          initialStatuses[q.id] = QUESTION_STATUS.NOT_ANSWERED;
        });
        setQuestionStatuses(initialStatuses);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Initialize current question's answer from savedAnswers when questions load
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion && savedAnswers[currentQuestion.id] !== undefined && answers[currentQuestion.id] === undefined) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: savedAnswers[currentQuestion.id]
        }));
      }
    }
  }, [questions.length, currentQuestionIndex]); // Only run when questions load or index changes

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const selectAnswer = useCallback((questionId: number, answerIndex: number) => {
    // Only update the selected answer, don't automatically save or change status
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex
    }));
  }, []);

  const markForReview = useCallback((questionId: number) => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: QUESTION_STATUS.MARKED
    }));
  }, []);

  const saveAnswer = useCallback((questionId: number) => {
    if (answers[questionId] !== undefined) {
      // Save the answer
      setSavedAnswers((prev) => ({
        ...prev,
        [questionId]: answers[questionId]
      }));
      setQuestionStatuses((prev) => ({
        ...prev,
        [questionId]: QUESTION_STATUS.ANSWERED
      }));
    }
  }, [answers]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      // Initialize selected answer from saved answer if available
      const question = questions[index];
      if (question && savedAnswers[question.id] !== undefined && answers[question.id] === undefined) {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: savedAnswers[question.id]
        }));
      }
    }
  }, [questions, savedAnswers, answers]);

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      // Initialize selected answer from saved answer if available
      const question = questions[nextIndex];
      if (question && savedAnswers[question.id] !== undefined && answers[question.id] === undefined) {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: savedAnswers[question.id]
        }));
      }
    }
  }, [currentQuestionIndex, questions, savedAnswers, answers]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      // Initialize selected answer from saved answer if available
      const question = questions[prevIndex];
      if (question && savedAnswers[question.id] !== undefined && answers[question.id] === undefined) {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: savedAnswers[question.id]
        }));
      }
    }
  }, [currentQuestionIndex, questions, savedAnswers, answers]);

  const saveAndNext = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && answers[currentQuestion.id] !== undefined) {
      saveAnswer(currentQuestion.id);
    }
    goToNext();
  }, [currentQuestionIndex, questions, answers, saveAnswer, goToNext]);

  const goToNextOnly = useCallback(() => {
    goToNext();
  }, [goToNext]);

  // Check if current question has unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    const selected = answers[currentQuestion.id];
    const saved = savedAnswers[currentQuestion.id];
    return selected !== undefined && selected !== saved;
  }, [currentQuestionIndex, questions, answers, savedAnswers]);

  const getStatusCounts = useCallback(() => {
    const counts: Record<string, number> = {
      [QUESTION_STATUS.ANSWERED]: 0,
      [QUESTION_STATUS.MARKED]: 0,
      [QUESTION_STATUS.NOT_ANSWERED]: 0
    };

    Object.values(questionStatuses).forEach((status) => {
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  }, [questionStatuses]);

  const getProgressPercentage = useCallback(() => {
    const counts = getStatusCounts();
    const total = questions.length;
    const answered = counts[QUESTION_STATUS.ANSWERED];
    return total > 0 ? (answered / total) * 100 : 0;
  }, [questions.length, getStatusCounts]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const value: MCQContextType = {
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    savedAnswers,
    questionStatuses,
    timeRemaining,
    isLoading,
    selectAnswer,
    markForReview,
    saveAnswer,
    goToQuestion,
    goToNext,
    goToPrevious,
    saveAndNext,
    goToNextOnly,
    hasUnsavedChanges,
    getStatusCounts,
    getProgressPercentage,
    formatTime
  };

  return <MCQContext.Provider value={value}>{children}</MCQContext.Provider>;
};

export const useMCQ = (): MCQContextType => {
  const context = useContext(MCQContext);
  if (!context) {
    throw new Error('useMCQ must be used within MCQProvider');
  }
  return context;
};

