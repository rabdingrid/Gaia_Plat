import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';
import Header from '../components/Header';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Header showUserInfo={true} showLogout={true} user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Test Assessment</h1>
          <p className="text-xl text-gray-600">Complete the tutorial for each section before starting the test</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* MCQ Section */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">Multiple Choice Questions</h2>
                  <p className="text-gray-600">Test your knowledge with multiple choice questions</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/tutorial/mcq')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Start Tutorial
              </button>
            </div>
          </div>

          {/* Coding Section */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">&lt;/&gt;</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">Coding Assessment</h2>
                  <p className="text-gray-600">Solve coding problems in your preferred language</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/tutorial/coding')}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Start Tutorial
              </button>
            </div>
          </div>

          {/* System Design Section */}
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏗️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">System Design</h2>
                  <p className="text-gray-600">Design scalable systems and architecture diagrams</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/tutorial/system-design')}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                Start Tutorial
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Complete all tutorials to understand the test format before starting
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

