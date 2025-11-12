import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

const TestScheduledPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 1,
    minutes: 58,
    seconds: 23,
  });

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E5] to-[#F5FCFF] relative overflow-hidden">
      {/* Header */}
      <Header showUserInfo={true} showLogout={true} showTechInterviewLogo={true} user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-5rem)] py-4 pb-8">
        {/* Inner Container - Main Card */}
        <div 
          className="rounded-2xl shadow-lg relative border-2"
          style={{
            width: '550px',
            height: '480px',
            padding: '18px',
            backgroundColor: '#FFFFFF',
            borderColor: '#FCD34D',
          }}
        >
          <div className="flex flex-col items-center justify-between h-full">
            {/* Clock Icon */}
            <div className="mt-6 mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50"></div>
                <svg 
                  className="w-8 h-8 text-white relative z-10" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Test Not Started Yet!</h1>
              <p className="text-sm text-gray-600">Please wait until the scheduled time to begin your test.</p>
            </div>

            {/* Countdown Timer */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs text-gray-600 text-center mb-3">Test starts in</p>
              <div className="flex items-center justify-center gap-1.5">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div 
                    className="rounded-lg flex items-center justify-center shadow-sm px-2.5 py-1.5"
                    style={{ backgroundColor: '#FFF7E5' }}
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {String(timeRemaining.hours).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-0.5">Hours</span>
                </div>

                <span className="text-lg font-bold text-gray-900 mb-5">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div 
                    className="rounded-lg flex items-center justify-center shadow-sm px-2.5 py-1.5"
                    style={{ backgroundColor: '#FFF7E5' }}
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {String(timeRemaining.minutes).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-0.5">Minutes</span>
                </div>

                <span className="text-lg font-bold text-gray-900 mb-5">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div 
                    className="rounded-lg flex items-center justify-center shadow-sm px-2.5 py-1.5"
                    style={{ backgroundColor: '#FFF7E5' }}
                  >
                    <span className="text-xl font-bold text-gray-900">
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-0.5">Seconds</span>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="flex gap-6 mb-6 w-full items-start justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-0.5">Test duration</p>
                <p className="text-sm font-semibold text-gray-900">180 mins</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-0.5">Position</p>
                <p className="text-sm font-semibold text-gray-900">Gen AI Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Instructions Section - Separate box below main card */}
        <div 
          className="rounded-lg bg-yellow-50 border border-orange-300 p-3"
          style={{
            width: '550px',
            marginTop: '12px',
            marginBottom: '24px',
          }}
        >
          <div className="flex items-start gap-2">
            <svg 
              className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Important Instructions</h3>
              <ul className="space-y-0.5 text-xs text-gray-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Please be ready 5 minutes before the scheduled time</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Ensure you have a stable internet connection</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>The test will automatically get started at the scheduled time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Start Test Button - Bottom Right */}
      <button
        onClick={() => navigate('/test/permissions')}
        className="absolute bottom-20 right-8 bg-green-600 text-white py-2 px-6 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors shadow-md"
      >
        Start Test
      </button>

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
    </div>
  );
};

export default TestScheduledPage;
