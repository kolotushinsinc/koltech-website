import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock, ArrowLeft, Zap, UserPlus } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState<'method' | 'classic' | 'verification'>('method');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClassicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // Отправка данных и переход к верификации
    setStep('verification');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Проверка кода и переход на главную KolTechLine
    window.location.href = '/koltechline';
    console.log('Verification code:', verificationCode);
  };

  const MethodSelection = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Регистрация</h1>
        <p className="text-gray-400">Выберите способ регистрации</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setStep('classic')}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 text-left"
        >
          <h3 className="font-bold text-lg mb-2">Классическая регистрация</h3>
          <p className="text-blue-100 text-sm">
            Регистрация с использованием email и стандартного пароля
          </p>
        </button>

        <Link
          to="/anonymous-register"
          className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 text-left block"
        >
          <h3 className="font-bold text-lg mb-2">LTMROW Method</h3>
          <p className="text-purple-100 text-sm">
            Анонимная регистрация с уникальным номером и кодовыми фразами
          </p>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Уже есть аккаунт?{' '}
          <Link
            to="/auth"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );

  const ClassicForm = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Классическая регистрация</h1>
        <p className="text-gray-400">Создайте аккаунт KolTech</p>
      </div>

      <form onSubmit={handleClassicSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите ваш email"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Введите ваше имя"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Фамилия</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Введите вашу фамилию"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Создайте пароль"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Повторите пароль"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2 mt-1"
            required
          />
          <label className="text-sm text-gray-300">
            Я соглашаюсь с{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">
              условиями использования
            </a>{' '}
            и{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">
              политикой конфиденциальности
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 neon-glow"
        >
          Зарегистрироваться
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={() => setStep('method')}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Назад к выбору способа
        </button>
      </div>
    </div>
  );

  const VerificationForm = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Подтверждение email</h1>
        <p className="text-gray-400">
          Мы отправили код подтверждения на <br />
          <span className="text-primary-400">{formData.email}</span>
        </p>
      </div>

      <form onSubmit={handleVerificationSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Код подтверждения</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Введите 4-значный код"
            maxLength={4}
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-green to-primary-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Подтвердить и войти в KolTechLine
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Отправить код повторно
          </button>
        </div>
      </form>
    </div>
  );

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

        {/* Render current step */}
        {step === 'method' && <MethodSelection />}
        {step === 'classic' && <ClassicForm />}
        {step === 'verification' && <VerificationForm />}
      </div>
    </div>
  );
};

export default Register;