// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { SystemDesignProvider, useSystemDesign } from '../../context/SystemDesignContext';
import DesignHeader from '../../components/SystemDesign/DesignHeader';
import ExcalidrawCanvas from '../../components/SystemDesign/ExcalidrawCanvas';
import ClarifyingChat from '../../components/SystemDesign/ClarifyingChat';
import SubmitBar from '../../components/SystemDesign/SubmitBar';
import { useFullscreenWarning } from '../../hooks/useFullscreenWarning';
import FullscreenWarningModal from '../../components/FullscreenWarningModal';
import FullscreenViolationModal from '../../components/FullscreenViolationModal';

const SystemDesignPageContent = () => {
  const { problem, isLoading } = useSystemDesign();
  // const navigate = useNavigate();

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
        <div className="text-lg text-gray-600">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-w-full flex flex-col bg-gray-50 overflow-hidden m-0 p-0">
      {/* Header */}
      <DesignHeader />

      {/* Progress Bar */}
      <div className="w-full h-1 bg-yellow-100 relative flex-shrink-0 m-0 p-0">
        <div className="h-full bg-yellow-400 transition-all duration-300 ease-out w-1/3"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-full h-0 m-0 p-0 overflow-hidden relative">
        {/* Left Panel (70%) */}
        <div className="w-[70%] flex-shrink-0 flex flex-col bg-white border-r border-gray-200 h-full overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Problem Section - Fixed height, scrollable */}
            <div className="flex-shrink-0 p-6 overflow-y-auto border-b border-gray-200 bg-gray-50" style={{ maxHeight: '200px' }}>
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900 mb-0">{problem?.title}</h2>
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed m-0">{problem?.description}</p>
              </div>
            </div>

            {/* Canvas and Actions Container */}
            <div className="flex-1 min-h-0 flex flex-col p-6 overflow-hidden">
              {/* Excalidraw Canvas - Takes most space */}
              <div className="flex-1 min-h-0 w-full mb-4">
                <ExcalidrawCanvas />
              </div>

              {/* Bottom Actions - Fixed height */}
              <div className="flex-shrink-0">
                {/* Submit Bar */}
                <SubmitBar />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (30%) - Chat */}
        <div className="w-[30%] flex-shrink-0 h-full bg-white border-l border-gray-200">
          <ClarifyingChat />
        </div>
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

const SystemDesignPage = () => {
  return (
    <SystemDesignProvider>
      <SystemDesignPageContent />
    </SystemDesignProvider>
  );
};

export default SystemDesignPage;

