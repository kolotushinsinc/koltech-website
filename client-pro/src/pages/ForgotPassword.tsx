import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Key, Check } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправка кода на email
    setStep('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Проверка кода
    setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // Сброс пароля
    setStep('success');
  };

  const EmailStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <Key className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Восстановление пароля</h1>
        <p className="text-gray-400">Введите email для восстановления доступа</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Отправить код восстановления
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/auth"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          Вспомнили пароль? Войти
        </Link>
      </div>
    </div>
  );

  const VerifyStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-primary-600 rounded-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Проверьте email</h1>
        <p className="text-gray-400">
          Код отправлен на <br />
          <span className="text-primary-400">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifySubmit} className="space-y-6">
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
          className="w-full bg-gradient-to-r from-blue-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Подтвердить код
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Отправить код повторно
          </button>
        </div>
      </form>
    </div>
  );

  const ResetStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Новый пароль</h1>
        <p className="text-gray-400">Создайте новый безопасный пароль</p>
      </div>

      <form onSubmit={handleResetSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Новый пароль</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Введите новый пароль"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите новый пароль"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Установить новый пароль
        </button>
      </form>
    </div>
  );

  const SuccessStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
          <Check className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-4">Пароль изменен!</h1>
      <p className="text-gray-300 mb-8">
        Ваш пароль успешно обновлен. Теперь вы можете войти в систему.
      </p>

      <Link
        to="/koltechline"
        className="inline-block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        Enter KolTechLine
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/auth"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к входу
        </Link>

        {/* Steps indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {['email', 'verify', 'reset', 'success'].map((stepName, index) => (
              <div
                key={stepName}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= ['email', 'verify', 'reset', 'success'].indexOf(step)
                    ? 'bg-orange-500'
                    : 'bg-dark-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Render current step */}
        {step === 'email' && <EmailStep />}
        {step === 'verify' && <VerifyStep />}
        {step === 'reset' && <ResetStep />}
        {step === 'success' && <SuccessStep />}
      </div>
    </div>
  );
};

export default ForgotPassword;