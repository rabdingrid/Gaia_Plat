import { useEffect, useState } from 'react';

interface FullscreenViolationModalProps {
  isOpen: boolean;
  onRedirect: () => void;
}

const FullscreenViolationModal = ({ isOpen, onRedirect }: FullscreenViolationModalProps) => {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (!isOpen) return;

    // Reset countdown when modal opens
    setCountdown(2);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-600" 
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

        <h2 className="text-3xl font-bold text-red-600 text-center mb-4">
          Rule Violation
        </h2>

        <p className="text-gray-700 text-center mb-6 text-lg">
          You have violated the fullscreen requirement by exiting fullscreen mode multiple times.
        </p>

        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <p className="text-center text-red-800 font-semibold text-base mb-2">
            You will be redirected to the exit screen in:
          </p>
          <div className="flex items-center justify-center">
            <div className="text-5xl font-bold text-red-600">
              {countdown}
            </div>
            <span className="text-2xl font-semibold text-red-600 ml-2">
              {countdown === 1 ? 'second' : 'seconds'}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Your test session will be automatically submitted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenViolationModal;

