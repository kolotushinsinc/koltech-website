import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Feedback } from './pages/Feedback';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'projects' | 'feedback'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверка наличия токена при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'projects' && <Projects />}
      {currentPage === 'feedback' && <Feedback />}
    </Layout>
  );
}

export default App;
