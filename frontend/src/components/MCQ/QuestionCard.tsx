import { useMCQ } from '../../context/MCQContext';
import OptionsList from './OptionsList';
import { useMCQNavigation } from '../../hooks/useMCQNavigation';

const QuestionCard = () => {
  const { currentQuestion, markForReview, saveAnswer, currentQuestionIndex, questions } = useMCQ();
  const { goToPrevious, saveAndNext, canGoPrevious } = useMCQNavigation();

  if (!currentQuestion) return null;

  const handleMarkForReview = () => {
    markForReview(currentQuestion.id);
  };

  const handleSaveAnswer = () => {
    saveAnswer(currentQuestion.id);
  };

  return (
    <div className="w-full max-w-full flex flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {currentQuestion.topic}
        </span>
        <span className="text-sm text-gray-600 font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      
      <div className="text-2xl font-semibold text-gray-800 leading-relaxed my-4 w-full break-words">
        {currentQuestion.question}
      </div>
      
      <OptionsList />
      
      <div className="flex justify-start gap-4 mt-4 w-full">
        <div className="flex gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-gray-200 rounded-lg text-base font-medium cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 text-gray-800" 
            onClick={handleMarkForReview}
          >
            <span className="text-base">🚩</span>
            Mark for Review
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-gray-200 rounded-lg text-base font-medium cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 text-gray-800" 
            onClick={handleSaveAnswer}
          >
            <span className="text-base">💾</span>
            Save Answer
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-8 py-2 bg-white border-t border-gray-200 mt-8 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] w-full">
        <button
          className={`px-8 py-3 rounded-lg text-base font-medium cursor-pointer transition-all ${
            !canGoPrevious 
              ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed' 
              : 'bg-gray-100 border-2 border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300'
          }`}
          onClick={goToPrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        <button 
          className="px-8 py-3 bg-gray-900 text-white rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-gray-800" 
          onClick={saveAndNext}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
