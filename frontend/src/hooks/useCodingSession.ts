import { useCoding } from '../context/CodingContext';

export const useCodingSession = () => {
  const {
    currentProblemIndex,
    problems,
    goToProblem,
    selectedLanguage,
    setLanguage
  } = useCoding();

  const canGoNext = currentProblemIndex < problems.length - 1;
  const canGoPrevious = currentProblemIndex > 0;
  const totalProblems = problems.length;

  return {
    currentProblemIndex,
    totalProblems,
    canGoNext,
    canGoPrevious,
    goToProblem,
    selectedLanguage,
    setLanguage
  };
};

