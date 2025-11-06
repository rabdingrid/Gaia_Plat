import { useMCQ } from '../context/MCQContext';

export const useMCQNavigation = () => {
  const {
    currentQuestionIndex,
    questions,
    goToQuestion,
    goToNext,
    goToPrevious,
    saveAndNext
  } = useMCQ();

  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const totalQuestions = questions.length;

  return {
    currentQuestionIndex,
    totalQuestions,
    canGoNext,
    canGoPrevious,
    goToQuestion,
    goToNext,
    goToPrevious,
    saveAndNext
  };
};

