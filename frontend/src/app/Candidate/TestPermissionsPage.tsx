import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

const TestPermissionsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [microphonePermission, setMicrophonePermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [fullscreenPermission, setFullscreenPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
      if (cameraStream) {
        setCameraPermission('granted');
        cameraStream.getTracks().forEach(track => track.stop());
      } else {
        setCameraPermission('denied');
      }

      // Check microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
      if (micStream) {
        setMicrophonePermission('granted');
        micStream.getTracks().forEach(track => track.stop());
      } else {
        setMicrophonePermission('denied');
      }

      // Check fullscreen availability
      if (document.fullscreenEnabled) {
        setFullscreenPermission('prompt');
      } else {
        setFullscreenPermission('denied');
      }
    } catch {
      setError('Failed to check permissions. Please ensure your browser supports media access.');
    } finally {
      setIsChecking(false);
    }
  };

  const requestPermissions = async () => {
    try {
      setError(null);
      setIsChecking(true);

      // Request both camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Permissions granted
      setCameraPermission('granted');
      setMicrophonePermission('granted');
      
      // Stop the stream immediately (we just needed permission)
      stream.getTracks().forEach(track => track.stop());

      // Request fullscreen
      try {
        if (document.fullscreenEnabled) {
          await document.documentElement.requestFullscreen();
          setFullscreenPermission('granted');
        } else {
          setFullscreenPermission('denied');
        }
      } catch {
        // Fullscreen request failed, but continue anyway
        setFullscreenPermission('denied');
      }

      setIsChecking(false);

      // Navigate to test overview after a short delay
      setTimeout(() => {
        navigate('/test-overview');
      }, 500);
    } catch {
      setError('Permission denied. Please allow camera and microphone access to continue.');
      setCameraPermission('denied');
      setMicrophonePermission('denied');
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const allPermissionsGranted = cameraPermission === 'granted' && microphonePermission === 'granted' && fullscreenPermission === 'granted';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E5] to-[#F5FCFF] relative overflow-hidden">
      {/* Header */}
      <Header showUserInfo={true} showLogout={true} showTechInterviewLogo={true} user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Permissions Required</h1>
            <p className="text-gray-600">We need access to your camera, microphone, and fullscreen mode for the assessment</p>
          </div>

          {/* Permissions Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 mb-6">
            {/* Camera Permission */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Camera Access</h3>
                    <p className="text-sm text-gray-600">Required for video monitoring during the test</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {cameraPermission === 'granted' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Granted</span>
                    </div>
                  ) : cameraPermission === 'denied' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Denied</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Microphone Permission */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Microphone Access</h3>
                    <p className="text-sm text-gray-600">Required for audio monitoring during the test</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {microphonePermission === 'granted' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Granted</span>
                    </div>
                  ) : microphonePermission === 'denied' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Denied</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Fullscreen Permission */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Fullscreen Access</h3>
                    <p className="text-sm text-gray-600">Required to prevent distractions during the test</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {fullscreenPermission === 'granted' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Granted</span>
                    </div>
                  ) : fullscreenPermission === 'denied' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Denied</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {!allPermissionsGranted ? (
              <button
                onClick={requestPermissions}
                disabled={isChecking}
                className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isChecking ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Requesting Permissions...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Allow Permissions</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/test-overview')}
                className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
              >
                <span>Continue to Test</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Why do we need these permissions?</h4>
                <p className="text-xs text-blue-800">
                  Camera and microphone access are required to ensure test integrity and monitor the assessment environment. 
                  Fullscreen mode helps prevent distractions and maintains test security. 
                  Your privacy is important to us, and all recordings are handled according to our privacy policy.
                </p>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default TestPermissionsPage;

