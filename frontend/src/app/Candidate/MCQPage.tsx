import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { MCQProvider, useMCQ } from '../../context/MCQContext';
import ProgressSidebar from '../../components/MCQ/ProgressSidebar';
import QuestionCard from '../../components/MCQ/QuestionCard';
import SubmitSectionModal from '../../components/MCQ/SubmitSectionModal';
import { useFullscreenWarning } from '../../hooks/useFullscreenWarning';
import FullscreenWarningModal from '../../components/FullscreenWarningModal';
import FullscreenViolationModal from '../../components/FullscreenViolationModal';

const MCQPageContent = () => {
  const { formatTime, timeRemaining, getProgressPercentage, isLoading, answers } = useMCQ();
//   const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  const handleSubmit = (submittedAnswers: Record<number, number>) => {
    console.log('Assessment submitted:', submittedAnswers);
    // Navigate to results page or show success message
    alert('Assessment submitted successfully!');
    setShowSubmitModal(false);
  };

  // Auto-submit when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0 && !isLoading && !hasAutoSubmitted) {
      setHasAutoSubmitted(true);
      handleSubmit(answers);
    }
  }, [timeRemaining, isLoading, hasAutoSubmitted, answers]);

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
        <div className="text-lg text-gray-600">Loading questions...</div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();

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
          <h1 className="text-2xl font-semibold text-gray-800">Multiple Choice Assessment</h1>
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
        {/* Left Sidebar */}
        <aside className="flex-[0_0_25%] w-1/4 min-w-[280px] bg-white border-r border-gray-200 p-6 overflow-y-auto overflow-x-hidden m-0 h-full">
          <ProgressSidebar />
        </aside>

        {/* Right Main Area */}
        <main className="flex-1 min-w-0 p-8 overflow-y-auto overflow-x-hidden bg-white m-0 h-full">
          <QuestionCard />
        </main>
      </div>

      {/* Submit Modal */}
      <SubmitSectionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmit}
      />

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

const MCQPage = () => {
  return (
    <MCQProvider>
      <MCQPageContent />
    </MCQProvider>
  );
};

export default MCQPage;
