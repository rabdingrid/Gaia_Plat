import { useEffect, useState } from 'react';
import { TourProvider, useTour } from '../../context/TourContext';
import TourOverlay from '../../components/Walkthrough/TourOverlay';
import { mcqTourSteps } from '../../components/Walkthrough/tourGuideSteps';

const TourMCQPageContent = () => {
  const { startTour, isRunning } = useTour();
  const [timeRemaining] = useState(3600); // 60 minutes

  useEffect(() => {
    // Start tour automatically
    startTour(mcqTourSteps);
  }, [startTour]);

  // Note: Navigation to home page is handled by StepTooltip when "Done" is clicked

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dummy data
  const dummyQuestion = {
    id: 1,
    topic: 'Data Structures',
    question: 'What is the time complexity of binary search?',
    options: [
      'O(n)',
      'O(log n)',
      'O(n log n)',
      'O(1)'
    ]
  };

  const dummyStatuses = {
    answered: 3,
    marked: 2,
    notAnswered: 5
  };

  const totalQuestions = 10;
  const progressPercentage = 30; // 3 answered out of 10

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
          <h1 className="text-2xl font-semibold text-gray-800">Multiple Choice Assessment</h1>
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
        {/* Left Sidebar */}
        <aside 
          data-tour="sidebar"
          className="flex-[0_0_25%] w-1/4 min-w-[280px] bg-white border-r border-gray-200 p-6 overflow-y-auto overflow-x-hidden m-0 h-full"
          style={{ pointerEvents: isRunning ? 'none' : 'auto' }}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Question Overview</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-green-100 text-green-600 text-sm">✓</div>
                  <span className="flex-1 text-sm text-gray-600">Answered</span>
                  <span className="font-semibold text-gray-800 min-w-6 text-right">{dummyStatuses.answered}</span>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-purple-100 text-purple-600 text-sm">🚩</div>
                  <span className="flex-1 text-sm text-gray-600">Marked</span>
                  <span className="font-semibold text-gray-800 min-w-6 text-right">{dummyStatuses.marked}</span>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-600 text-sm">⚪</div>
                  <span className="flex-1 text-sm text-gray-600">Not Answered</span>
                  <span className="font-semibold text-gray-800 min-w-6 text-right">{dummyStatuses.notAnswered}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">All Questions</h3>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: totalQuestions }).map((_, index) => {
                  const isActive = index === 0;
                  const isAnswered = index < 3;
                  const isMarked = index >= 3 && index < 5;
                  
                  let className = 'aspect-square rounded-lg border-2 font-semibold text-base cursor-pointer flex items-center justify-center relative transition-all hover:scale-105';
                  
                  if (isActive) {
                    className += ' border-black border-[3px] bg-yellow-100';
                  }
                  
                  if (isAnswered) {
                    className += ' bg-green-100 border-green-500 text-green-600';
                  } else if (isMarked) {
                    className += ' bg-purple-600 border-purple-600 text-white';
                  } else {
                    className += ' bg-yellow-100 border-yellow-400 text-gray-800';
                  }
                  
                  return (
                    <button
                      key={index}
                      className={className}
                    >
                      {isMarked && (
                        <span className="absolute text-xs">🚩</span>
                      )}
                      <span>{index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Area */}
        <main 
          data-tour="question-card"
          className="flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden bg-white m-0 h-full"
          style={{ pointerEvents: isRunning ? 'none' : 'auto' }}
        >
          <div className="w-full max-w-full flex flex-col gap-6">
            <div className="flex justify-between items-center w-full">
              <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {dummyQuestion.topic}
              </span>
              <span className="text-sm text-gray-600 font-medium">
                Question 1 of {totalQuestions}
              </span>
            </div>
            
            <div className="text-2xl font-semibold text-gray-800 leading-relaxed my-4 w-full break-words">
              {dummyQuestion.question}
            </div>
            
            <div className="space-y-3 mb-8">
              {dummyQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    className="mr-3 w-5 h-5 text-blue-600"
                    disabled={isRunning}
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-start gap-4 mt-4 w-full">
              <div className="flex gap-4">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-gray-200 rounded-lg text-base font-medium cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 text-gray-800"
                  disabled={isRunning}
                >
                  <span className="text-base">🚩</span>
                  Mark for Review
                </button>
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-gray-200 rounded-lg text-base font-medium cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 text-gray-800"
                  disabled={isRunning}
                >
                  <span className="text-base">💾</span>
                  Save Answer
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-8 py-2 bg-white border-t border-gray-200 mt-8 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] w-full">
              <button
                className="px-8 py-3 rounded-lg text-base font-medium bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed"
                disabled={isRunning}
              >
                Previous
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-gray-800"
                disabled={isRunning}
              >
                Save & Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const TourMCQPage = () => {
  return (
    <TourProvider>
      <TourMCQPageContent />
    </TourProvider>
  );
};

export default TourMCQPage;

