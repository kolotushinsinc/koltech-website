import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';

const AnonymousRegister = () => {
  const [step, setStep] = useState<'info' | 'generate' | 'phrases' | 'verification' | 'complete'>('info');
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [generatedPhrases, setGeneratedPhrases] = useState<string[]>([]);
  const [verificationAnswers, setVerificationAnswers] = useState<{ [key: number]: string }>({});
  const [verificationQuestions, setVerificationQuestions] = useState<{ index: number; phrase: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPhrases, setShowPhrases] = useState(true);

  // Генерация уникального номера
  const generateLetteraTechNumber = () => {
    const base = '+11111';
    const random = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
    return base + random;
  };

  // Генерация кодовых фраз
  const generateCodePhrases = (): string[] => {
    const adjectives = [
      'быстрый', 'тихий', 'яркий', 'темный', 'высокий', 'низкий', 'широкий', 'узкий',
      'горячий', 'холодный', 'мягкий', 'твердый', 'острый', 'тупой', 'длинный', 'короткий'
    ];
    const nouns = [
      'волк', 'орел', 'море', 'гора', 'звезда', 'луна', 'солнце', 'лес', 'река', 'камень',
      'огонь', 'лед', 'ветер', 'дождь', 'снег', 'гром', 'молния', 'туман'
    ];
    const numbers = Array.from({length: 100}, (_, i) => (i + 1).toString());

    const phrases: string[] = [];
    for (let i = 0; i < 12; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];
      phrases.push(`${adjective}-${noun}-${number}`);
    }
    return phrases;
  };

  // Генерация вопросов для верификации
  const generateVerificationQuestions = (phrases: string[]): { index: number; phrase: string }[] => {
    const shuffled = phrases.map((phrase, index) => ({ index, phrase }))
      .sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6); // Проверяем 6 из 12 фраз
  };

  const handleGenerate = () => {
    const number = generateLetteraTechNumber();
    const phrases = generateCodePhrases();
    const questions = generateVerificationQuestions(phrases);
    
    setGeneratedNumber(number);
    setGeneratedPhrases(phrases);
    setVerificationQuestions(questions);
    setStep('generate');
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVerificationSubmit = () => {
    const allCorrect = verificationQuestions.every(q => 
      verificationAnswers[q.index] === q.phrase
    );
    
    if (allCorrect) {
      setStep('complete');
    } else {
      alert('Некоторые фразы введены неверно. Проверьте и попробуйте снова.');
    }
  };

  const InfoStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">LTMROW Method</h1>
        <p className="text-gray-400">Lettera Tech Method Registration Of World</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-dark-700 p-6 rounded-xl border border-dark-600">
          <h3 className="text-white font-semibold mb-3">Что такое LTMROW?</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Это революционный метод анонимной регистрации, который обеспечивает максимальную 
            безопасность и конфиденциальность. Система генерирует уникальный номер и набор 
            кодовых фраз для защиты вашей учетной записи.
          </p>
        </div>

        <div className="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 p-6 rounded-xl border border-accent-purple/30">
          <h3 className="text-white font-semibold mb-3">Особенности LTMROW:</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-purple rounded-full mr-3"></div>
              Полная анонимность - никаких личных данных
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-pink rounded-full mr-3"></div>
              Уникальный 16-символьный номер
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-purple rounded-full mr-3"></div>
              12 кодовых фраз для восстановления
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-pink rounded-full mr-3"></div>
              Максимальная безопасность данных
            </li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
          <p className="text-yellow-300 text-sm">
            <strong>Важно:</strong> Обязательно сохраните кодовые фразы в безопасном месте. 
            Без них восстановление доступа будет невозможно.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Начать регистрацию LTMROW
        </button>
        
        <Link
          to="/register"
          className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-dark-600 transition-all duration-300 block text-center"
        >
          Назад к выбору способа
        </Link>
      </div>
    </div>
  );

  const GenerateStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ваш LetteraTech номер</h1>
        <p className="text-gray-400">Сохраните этот номер - он ваш логин</p>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary-500/20 to-accent-purple/20 p-6 rounded-xl border border-primary-500/30 text-center">
          <p className="text-sm text-gray-400 mb-2">Ваш уникальный номер:</p>
          <p className="text-2xl font-mono font-bold text-white mb-4 tracking-wider">
            {generatedNumber}
          </p>
          <button
            onClick={() => copyToClipboard(generatedNumber, -1)}
            className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors"
          >
            {copiedIndex === -1 ? (
              <>
                <Check className="w-4 h-4" />
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Копировать</span>
              </>
            )}
          </button>
        </div>
      </div>

      <button
        onClick={() => setStep('phrases')}
        className="w-full bg-gradient-to-r from-accent-green to-primary-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        Продолжить к кодовым фразам
      </button>
    </div>
  );

  const PhrasesStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Кодовые фразы</h1>
        <p className="text-gray-400">Сохраните все 12 фраз в безопасном месте</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">Ваши кодовые фразы:</h3>
          <button
            onClick={() => setShowPhrases(!showPhrases)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            {showPhrases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">{showPhrases ? 'Скрыть' : 'Показать'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {generatedPhrases.map((phrase, index) => (
            <div
              key={index}
              className="bg-dark-700 border border-dark-600 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="bg-dark-600 text-gray-400 px-2 py-1 rounded text-xs font-mono">
                  #{index + 1}
                </span>
                <span className={`font-mono ${showPhrases ? 'text-white' : 'text-transparent bg-dark-600 rounded select-none'}`}>
                  {showPhrases ? phrase : '••••••••••••'}
                </span>
              </div>
              {showPhrases && (
                <button
                  onClick={() => copyToClipboard(phrase, index)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30 mb-6">
        <p className="text-red-300 text-sm">
          <strong>Критически важно:</strong> Без этих фраз восстановление доступа невозможно. 
          Сохраните их в нескольких безопасных местах.
        </p>
      </div>

      <button
        onClick={() => setStep('verification')}
        className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        Я сохранил фразы, продолжить
      </button>
    </div>
  );

  const VerificationStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Проверка фраз</h1>
        <p className="text-gray-400">Введите запрашиваемые кодовые фразы</p>
      </div>

      <div className="space-y-6 mb-8">
        {verificationQuestions.map((question, i) => (
          <div key={question.index}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Кодовая фраза #{question.index + 1}
            </label>
            <input
              type="text"
              value={verificationAnswers[question.index] || ''}
              onChange={(e) => setVerificationAnswers(prev => ({
                ...prev,
                [question.index]: e.target.value
              }))}
              placeholder="Введите фразу"
              className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={handleVerificationSubmit}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Проверить и завершить регистрацию
        </button>
        
        <button
          onClick={() => setStep('phrases')}
          className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-2 px-4 rounded-xl font-medium hover:bg-dark-600 transition-all duration-300"
        >
          Назад к фразам
        </button>
      </div>
    </div>
  );

  const CompleteStep = () => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
          <Check className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-4">Регистрация завершена!</h1>
      <p className="text-gray-300 mb-8">
        Ваш аккаунт LTMROW успешно создан. Добро пожаловать в KolTechLine!
      </p>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30 mb-8">
        <p className="text-sm text-gray-300 mb-2">Ваш номер для входа:</p>
        <p className="text-xl font-mono font-bold text-white">{generatedNumber}</p>
      </div>

      <button
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
        onClick={() => {
          // Переход на главную страницу KolTechLine
          window.location.href = '/koltechline';
        }}
      >
        Перейти в KolTechLine
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <Link
          to="/register"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к регистрации
        </Link>

        {/* Steps indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {['info', 'generate', 'phrases', 'verification', 'complete'].map((stepName, index) => (
              <div
                key={stepName}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= ['info', 'generate', 'phrases', 'verification', 'complete'].indexOf(step)
                    ? 'bg-accent-purple'
                    : 'bg-dark-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Render current step */}
        {step === 'info' && <InfoStep />}
        {step === 'generate' && <GenerateStep />}
        {step === 'phrases' && <PhrasesStep />}
        {step === 'verification' && <VerificationStep />}
        {step === 'complete' && <CompleteStep />}
      </div>
    </div>
  );
};

export default AnonymousRegister;