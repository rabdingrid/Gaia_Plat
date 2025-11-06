import { useMCQ } from '../../context/MCQContext';
import { QUESTION_STATUS } from '../../utils/constants';
import QuestionStatusCounters from './QuestionStatusCounters';

const ProgressSidebar = () => {
  const { questions, currentQuestionIndex, questionStatuses, goToQuestion } = useMCQ();

  const getQuestionButtonClass = (index: number, questionId: number): string => {
    const status = questionStatuses[questionId] || QUESTION_STATUS.NOT_ANSWERED;
    const isActive = index === currentQuestionIndex;
    
    let className = 'aspect-square rounded-lg border-2 font-semibold text-base cursor-pointer flex items-center justify-center relative transition-all hover:scale-105';
    
    if (isActive) {
      className += ' border-black border-[3px] bg-yellow-100';
    }
    
    if (status === QUESTION_STATUS.ANSWERED) {
      className += ' bg-green-100 border-green-500 text-green-600';
    } else if (status === QUESTION_STATUS.MARKED) {
      className += ' bg-purple-600 border-purple-600 text-white';
    } else {
      className += ' bg-yellow-100 border-yellow-400 text-gray-800';
    }
    
    return className;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Question Overview</h3>
        <QuestionStatusCounters />
      </div>
      
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">All Questions</h3>
        <div className="grid grid-cols-4 gap-3">
          {questions.map((question, index) => (
            <button
              key={question.id}
              className={getQuestionButtonClass(index, question.id)}
              onClick={() => goToQuestion(index)}
            >
              {questionStatuses[question.id] === QUESTION_STATUS.MARKED && (
                <span className="absolute text-xs">🚩</span>
              )}
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar;
