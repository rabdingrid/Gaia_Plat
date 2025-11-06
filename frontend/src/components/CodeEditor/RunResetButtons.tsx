import { useCoding } from '../../context/CodingContext';

const RunResetButtons = () => {
  const { resetCode, runCode, isRunning } = useCoding();

  return (
    <>
      <button
        onClick={resetCode}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
      >
        <span className="text-base">↻</span>
        Reset
      </button>
      <button
        onClick={runCode}
        disabled={isRunning}
        className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-base">▷</span>
        Run Code
      </button>
    </>
  );
};

export default RunResetButtons;

