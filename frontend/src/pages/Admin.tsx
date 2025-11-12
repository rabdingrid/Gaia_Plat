import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Admin = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showUserInfo={true} showLogout={true} user={user} onLogout={handleLogout} />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Admin content goes here</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
