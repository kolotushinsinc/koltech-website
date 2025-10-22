import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Briefcase } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log('Auth data:', formData);
    // Временно перенаправляем на dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="card p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-3 rounded-xl shadow-glow-sm">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">KolTech Pro</h1>
            <p className="text-dark-300">Войдите в личный кабинет</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Field */}
            <div>
              <label className="form-label">
                Email или имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Введите email или имя пользователя"
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="form-label">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Введите пароль"
                  className="form-input pl-10 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-dark-300">Запомнить меня</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Забыли пароль?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-3"
            >
              Войти
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-dark-300">
              Нет аккаунта?{' '}
              <button
                type="button"
                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Свяжитесь с нами
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-dark-400">
            Защищенное соединение • KolTech Pro © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
