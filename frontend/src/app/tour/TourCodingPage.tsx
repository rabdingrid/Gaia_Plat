import { useEffect, useState } from 'react';
import { TourProvider, useTour } from '../../context/TourContext';
import TourOverlay from '../../components/Walkthrough/TourOverlay';
import { codingTourSteps } from '../../components/Walkthrough/tourGuideSteps';

const TourCodingPageContent = () => {
  const { startTour, isRunning } = useTour();
  const [timeRemaining] = useState(3600);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'java'>('python');

  useEffect(() => {
    startTour(codingTourSteps);
  }, [startTour]);

  // Note: Navigation to home page is handled by StepTooltip when "Done" is clicked

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dummyProblem = {
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹'
    ]
  };

  const totalProblems = 4;
  const progressPercentage = 25;

  return (
    <div className="w-full h-screen max-w-full flex flex-col bg-gray-50 overflow-hidden m-0 p-0 relative">
      <TourOverlay />

      {/* Header */}
      <header 
        data-tour="header"
        className="w-full max-w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm m-0 flex-shrink-0"
        style={{ pointerEvents: isRunning ? 'none' : 'auto' }}
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-transparent border-none cursor-pointer text-base text-gray-800 hover:text-blue-600 transition-colors">
          <span className="text-xl">←</span>
          Back
        </button>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <span className="text-2xl text-gray-600">&lt;/&gt;</span>
          <h1 className="text-2xl font-semibold text-gray-800">Coding Assessment</h1>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md font-semibold text-base">
            <span className="text-base">🕐</span>
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <button
            data-tour="submit-button"
            className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-md font-semibold text-base cursor-pointer hover:bg-yellow-500 transition-colors"
          >
            Submit Solution
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div 
        data-tour="progress-bar"
        className="w-full h-1 bg-yellow-100 relative flex-shrink-0 m-0 p-0"
      >
        <div
          className="h-full bg-yellow-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-full h-0 m-0 p-0 overflow-hidden relative">
        {/* Left Column - Problem Description */}
        <aside className="w-1/2 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden h-full">
          <div className="p-6">
            {/* Question Navigation Bar */}
            <div 
              data-tour="question-nav"
              className="mb-6 flex gap-2"
            >
              {Array.from({ length: totalProblems }).map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    index === 0
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={isRunning}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>

            <div data-tour="problem-description">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{dummyProblem.title}</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {dummyProblem.difficulty}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Description</h3>
                <p className="text-gray-700 leading-relaxed">{dummyProblem.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                {dummyProblem.examples.map((example, index) => (
                  <div key={index} className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Example {index + 1}:</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Input: </span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{example.input}</code>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Output: </span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Explanation: </span>
                        <span className="text-sm text-gray-600">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  {dummyProblem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column - Code Editor */}
        <div className="w-1/2 flex-shrink-0 bg-white overflow-hidden flex flex-col">
          <div className="flex-shrink-0 border-b border-gray-200">
            <div className="flex">
              {(['python', 'javascript', 'java'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => !isRunning && setSelectedLanguage(lang)}
                  className={`px-6 py-3 text-sm font-medium ${
                    selectedLanguage === lang
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  disabled={isRunning}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div 
            data-tour="code-editor"
            className="flex-1 h-0 bg-gray-900 text-white p-4 font-mono text-sm overflow-auto"
          >
            <pre className="text-green-400">
{selectedLanguage === 'python' ? `def twoSum(nums, target):
    # Your code here
    pass` : selectedLanguage === 'javascript' ? `function twoSum(nums, target) {
    // Your code here
}` : `public int[] twoSum(int[] nums, int target) {
    // Your code here
}`}
            </pre>
          </div>

          <div 
            data-tour="test-cases"
            className="flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50"
          >
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-900">Test Cases</h4>
            </div>
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-600 mb-1">Input: [2,7,11,15], 9</div>
                <div className="text-xs text-gray-600">Expected: [0,1]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TourCodingPage = () => {
  return (
    <TourProvider>
      <TourCodingPageContent />
    </TourProvider>
  );
};

export default TourCodingPage;

