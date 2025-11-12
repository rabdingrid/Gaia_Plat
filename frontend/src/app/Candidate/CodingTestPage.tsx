import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodingProvider, useCoding } from '../../context/CodingContext';
import LanguageTabs from '../../components/CodeEditor/LanguageTabs';
import EditorHeader from '../../components/CodeEditor/EditorHeader';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import TestCaseViewer from '../../components/CodeEditor/TestCaseViewer';
import OutputViewer from '../../components/CodeEditor/OutputViewer';
import { useCodingSession } from '../../hooks/useCodingSession';
import { useFullscreenWarning } from '../../hooks/useFullscreenWarning';
import FullscreenWarningModal from '../../components/FullscreenWarningModal';
import FullscreenViolationModal from '../../components/FullscreenViolationModal';

const CodingTestPageContent = () => {
  const { formatTime, timeRemaining, getProgressPercentage, isLoading, currentProblem } = useCoding();
  const { goToProblem, currentProblemIndex, totalProblems } = useCodingSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'testcases' | 'output'>('testcases');
  const [_showSubmitModal, setShowSubmitModal] = useState(false);

  // Monitor fullscreen exit with warning system
  const { attemptsRemaining, showWarning, showViolation, closeWarning, handleRedirect } = useFullscreenWarning({
    maxAttempts: 2,
    onFinalAttempt: () => {
      // This will be called on the 3rd attempt (final)
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading problems...</div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-screen max-w-full flex flex-col bg-gray-50 overflow-hidden m-0 p-0">
      {/* Header */}
      <header className="w-full max-w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm m-0 flex-shrink-0">
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
            className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-md font-semibold text-base cursor-pointer hover:bg-yellow-500 transition-colors"
            onClick={() => setShowSubmitModal(true)}
          >
            Submit Solution
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-yellow-100 relative flex-shrink-0 m-0 p-0">
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
            <div className="mb-6 flex gap-2">
              {Array.from({ length: totalProblems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProblem(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentProblemIndex === index
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>

            {currentProblem && (
              <>
                {/* Title and Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">{currentProblem.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                    {currentProblem.difficulty}
                  </span>
                </div>

                {/* Problem Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Description</h3>
                  <p className="text-gray-700 leading-relaxed">{currentProblem.description}</p>
                </div>

                {/* Examples */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                  {currentProblem.examples.map((example, index) => (
                    <div key={index} className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Example {index + 1}:</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Input: </span>
                        <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded">{example.input}</code>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Output: </span>
                        <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded">{example.output}</code>
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

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                  <ul className="list-none space-y-2">
                    {currentProblem.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-gray-600">→</span>
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Right Column - Code Editor */}
        <main className="w-1/2 flex-shrink-0 flex flex-col bg-white h-full overflow-hidden">
          {/* Language Tabs */}
          <LanguageTabs />

          {/* Editor Header */}
          <EditorHeader />

          {/* Code Editor */}
          <div className="flex-1 min-h-0 border-b border-gray-200">
            <CodeEditor />
          </div>

          {/* Bottom Panel - Testcases/Output */}
          <div className="flex-shrink-0 h-64 flex flex-col border-t border-gray-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'testcases'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Testcases
              </button>
              <button
                onClick={() => setActiveTab('output')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'output'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Output
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'testcases' ? <TestCaseViewer /> : <OutputViewer />}
            </div>
          </div>
        </main>
      </div>

      {/* Fullscreen Warning Modal */}
      <FullscreenWarningModal
        isOpen={showWarning}
        attemptsRemaining={attemptsRemaining}
        onClose={closeWarning}
      />

      {/* Fullscreen Violation Modal */}
      <FullscreenViolationModal
        isOpen={showViolation}
        onRedirect={handleRedirect}
      />
    </div>
  );
};

const CodingTestPage = () => {
  return (
    <CodingProvider>
      <CodingTestPageContent />
    </CodingProvider>
  );
};

export default CodingTestPage;

