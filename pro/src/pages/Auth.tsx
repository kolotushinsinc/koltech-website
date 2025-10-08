import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowLeft, Zap } from 'lucide-react';

const Auth = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'username' | 'number'>('email');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const detectLoginType = (value: string) => {
    if (value.startsWith('+11111')) {
      setLoginType('number');
    } else if (value.includes('@')) {
      setLoginType('email');
    } else {
      setLoginType('username');
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, login: value }));
    detectLoginType(value);
  };

  const getLoginPlaceholder = () => {
    switch (loginType) {
      case 'email': return 'Введите email';
      case 'username': return 'Введите имя пользователя';
      case 'number': return 'LetteraTech номер';
      default: return 'Email, Username или LetteraTech номер';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log('Auth data:', formData);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Link>

        {/* Auth Card */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать</h1>
            <p className="text-gray-400">Войдите в вашу учетную запись KolTech Pro</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {loginType === 'email' ? 'Email' : 
                 loginType === 'username' ? 'Имя пользователя' : 
                 'LetteraTech номер'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleLoginChange}
                  placeholder={getLoginPlaceholder()}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required
                />
              </div>
              {loginType === 'number' && (
                <p className="text-xs text-gray-500 mt-1">
                  Формат: +11111XXXXXXXXXXX
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль {loginType === 'number' && '/ PIN-код'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={loginType === 'number' ? 'PIN-код или кодовые фразы' : 'Введите пароль'}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Запомнить меня</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 neon-glow"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;