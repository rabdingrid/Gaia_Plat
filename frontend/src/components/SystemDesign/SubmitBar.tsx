import { useSystemDesign } from '../../context/SystemDesignContext';

const SubmitBar = () => {
  const { timeRemaining } = useSystemDesign();

  return (
    <div className="flex justify-end">
      <button 
        disabled={timeRemaining === 0}
        className="px-8 py-3 bg-gray-900 text-white rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Submit Design
      </button>
    </div>
  );
};

export default SubmitBar;

