import { useMCQ } from '../../context/MCQContext';

const OptionsList = () => {
  const { currentQuestion, answers, savedAnswers, selectAnswer } = useMCQ();

  if (!currentQuestion) return null;

  // Show selected answer if available, otherwise show saved answer
  const selectedAnswer = answers[currentQuestion.id] !== undefined 
    ? answers[currentQuestion.id] 
    : savedAnswers[currentQuestion.id];

  const handleOptionClick = (optionIndex: number) => {
    selectAnswer(currentQuestion.id, optionIndex);
  };

  return (
    <div className="flex flex-col gap-4 my-4 w-full">
      {currentQuestion.options.map((option, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 p-5 border-2 rounded-xl bg-white cursor-pointer transition-all w-full ${
            selectedAnswer === index
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onClick={() => handleOptionClick(index)}
        >
          <div className="flex items-center justify-center">
            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${
              selectedAnswer === index ? 'border-blue-500' : 'border-gray-400'
            }`}>
              {selectedAnswer === index && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          <span className="flex-1 text-lg text-gray-800">{option}</span>
        </div>
      ))}
    </div>
  );
};

export default OptionsList;
