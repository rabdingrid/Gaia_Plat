import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import { useFullscreenWarning } from '../../hooks/useFullscreenWarning';
import FullscreenWarningModal from '../../components/FullscreenWarningModal';
import FullscreenViolationModal from '../../components/FullscreenViolationModal';

const TestOverviewPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor fullscreen exit with warning system
  const { attemptsRemaining, showWarning, showViolation, closeWarning, handleRedirect } = useFullscreenWarning({
    maxAttempts: 2,
    onFinalAttempt: () => {
      // This will be called on the 3rd attempt (final)
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
  };

  const handleSolve = (section: string) => {
    if (section === 'mcq') {
      navigate('/candidate/mcq');
    } else if (section === 'coding') {
      navigate('/candidate/coding');
    } else if (section === 'system-design') {
      navigate('/candidate/system-design');
    }
  };

  const handleSubmitTest = () => {
    // Navigate to test completed page with replace to prevent back navigation
    navigate('/test/completed', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E5] to-[#F5FCFF] relative overflow-hidden">
      {/* Header */}
      <Header 
        showUserInfo={true} 
        showLogout={true} 
        showTechInterviewLogo={true} 
        showTimer={true}
        timerValue={formatTime(timeRemaining)}
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-5rem)] py-8 pb-8">
        <div className="flex gap-8 mb-8">
          {/* Section 1 - Multiple Choice Question */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 w-96 h-96 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-3">Section 1</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">Multiple Choice Question</h2>
              <div className="mb-6">
                <p className="text-base text-gray-600 mb-2">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">20</p>
              </div>
            </div>
            <button
              onClick={() => handleSolve('mcq')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors"
            >
              Solve
            </button>
          </div>

          {/* Section 2 - Coding Test */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 w-96 h-96 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-3">Section 2</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">Coding Test</h2>
              <div className="mb-6">
                <p className="text-base text-gray-600 mb-2">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">4</p>
              </div>
            </div>
            <button
              onClick={() => handleSolve('coding')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors"
            >
              Solve
            </button>
          </div>

          {/* Section 3 - System Design */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 w-96 h-96 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-3">Section 3</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">System Design</h2>
              <div className="mb-6">
                <p className="text-base text-gray-600 mb-2">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
              </div>
            </div>
            <button
              onClick={() => handleSolve('system-design')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors"
            >
              Solve
            </button>
          </div>
        </div>

        {/* Submit Test Button */}
        <div className="w-full flex justify-end" style={{ paddingRight: '8.5rem' }}>
          <button
            onClick={handleSubmitTest}
            className="bg-orange-500 text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Contact Support
          </a>
        </div>
      </footer>

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

export default TestOverviewPage;

