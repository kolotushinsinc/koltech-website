import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import axios from 'axios';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email некорректен';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('https://api.koltech.dev/api/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        onLogin();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setLoginError(error.response.data.message || 'Ошибка входа');
      } else {
        setLoginError('Ошибка соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 border border-white/10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg inline-flex mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Вход в систему</h1>
          <p className="text-slate-400">Введите данные для доступа к KolTech CRM</p>
        </div>

        {loginError && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Вход...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}