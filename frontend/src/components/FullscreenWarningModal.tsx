interface FullscreenWarningModalProps {
  isOpen: boolean;
  attemptsRemaining: number;
  onClose: () => void;
}

const FullscreenWarningModal = ({ isOpen, attemptsRemaining, onClose }: FullscreenWarningModalProps) => {
  const requestFullscreen = () => {
    const element = document.documentElement;
    
    // Try standard fullscreen API
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err: Error) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      return;
    }
    
    // Try webkit (Chrome/Safari)
    const webkitRequestFullscreen = (element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen;
    if (webkitRequestFullscreen) {
      webkitRequestFullscreen.call(element).catch((err: Error) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      return;
    }
    
    // Try moz (Firefox)
    const mozRequestFullScreen = (element as HTMLElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen;
    if (mozRequestFullScreen) {
      mozRequestFullScreen.call(element).catch((err: Error) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      return;
    }
    
    // Try ms (IE/Edge)
    const msRequestFullscreen = (element as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen;
    if (msRequestFullscreen) {
      msRequestFullscreen.call(element).catch((err: Error) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    }
  };

  const handleClose = () => {
    // Request fullscreen immediately while user interaction is still valid
    requestFullscreen();
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Fullscreen Mode Required
        </h2>

        <p className="text-gray-700 text-center mb-6">
          You must remain in fullscreen mode during the test. Exiting fullscreen is not allowed.
        </p>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg 
              className="w-5 h-5 text-red-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {/* <span className="text-lg font-bold text-red-800">
              Warning: {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
            </span> */}
          </div>
          <p className="text-sm text-red-700 text-center">
            {attemptsRemaining === 1 
              ? 'If you exit fullscreen again, your test will be automatically submitted.'
              : 'If you exit fullscreen 2 more times, your test will be automatically submitted.'}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold text-base hover:bg-yellow-600 transition-colors shadow-md"
        >
          I Understand - Return to Fullscreen
        </button>
      </div>
    </div>
  );
};

export default FullscreenWarningModal;

