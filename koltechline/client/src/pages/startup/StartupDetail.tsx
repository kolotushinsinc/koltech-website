import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin,
  Globe,
  Briefcase,
  Star,
  MessageSquare,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Временная заглушка для данных
const MOCK_STARTUP = {
  id: '1',
  name: 'HealthTech AI',
  tagline: 'Искусственный интеллект для диагностики заболеваний',
  description: `
    <p>Мы разрабатываем систему на базе искусственного интеллекта для ранней диагностики заболеваний по медицинским изображениям с точностью выше 95%.</p>
    
    <h3>Проблема</h3>
    <p>Ежегодно миллионы людей страдают от поздней диагностики заболеваний, что значительно снижает эффективность лечения и увеличивает смертность. Традиционные методы диагностики требуют значительного времени и высококвалифицированных специалистов, которых не хватает во многих регионах.</p>
    
    <h3>Решение</h3>
    <p>Наша система использует глубокое обучение для анализа медицинских изображений (рентген, МРТ, КТ) и выявления признаков заболеваний на ранних стадиях. Алгоритм обучен на миллионах размеченных изображений и показывает точность выше, чем у среднего радиолога.</p>
    
    <h3>Технология</h3>
    <ul>
      <li>Нейронные сети на базе архитектуры ResNet и U-Net</li>
      <li>Облачная инфраструктура для обработки больших объемов данных</li>
      <li>API для интеграции с существующими медицинскими информационными системами</li>
      <li>Мобильное приложение для врачей с возможностью получения результатов в режиме реального времени</li>
    </ul>
    
    <h3>Рынок</h3>
    <p>Глобальный рынок ИИ в здравоохранении оценивается в $10 млрд и, по прогнозам, достигнет $45 млрд к 2030 году. Наш целевой сегмент — медицинские учреждения, страховые компании и телемедицинские сервисы.</p>
  `,
  industry: 'Healthcare',
  stage: 'early-growth',
  logo: '',
  coverImage: '',
  founderId: 'founder1',
  founderName: 'Алексей Иванов',
  founderAvatar: '',
  founderBio: 'Серийный предприниматель с опытом в медицинских технологиях. Ранее основал и успешно продал стартап в области телемедицины.',
  teamSize: 5,
  team: [
    { id: 'member1', name: 'Мария Петрова', role: 'CTO', avatar: '' },
    { id: 'member2', name: 'Иван Сидоров', role: 'Lead ML Engineer', avatar: '' },
    { id: 'member3', name: 'Елена Козлова', role: 'Medical Advisor', avatar: '' },
    { id: 'member4', name: 'Дмитрий Новиков', role: 'Frontend Developer', avatar: '' }
  ],
  funding: {
    goal: 500000,
    raised: 150000,
    currency: 'USD',
    equityOffered: 15,
    minInvestment: 10000
  },
  metrics: {
    users: 1200,
    growth: 25,
    revenue: 50000,
    churn: 5
  },
  location: 'Москва, Россия',
  website: 'https://healthtech-ai.example.com',
  foundedAt: new Date('2024-03-15'),
  pitchDeck: 'https://example.com/pitch-deck.pdf',
  businessPlan: 'https://example.com/business-plan.pdf',
  demoVideo: 'https://example.com/demo-video.mp4',
  jobs: [
    {
      id: 'job1',
      title: 'Senior Backend Developer',
      type: 'full-time',
      location: 'Москва',
      remote: true,
      description: 'Разработка и поддержка серверной части приложения на Python/Django.',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      id: 'job2',
      title: 'ML Engineer',
      type: 'full-time',
      location: 'Москва',
      remote: false,
      description: 'Разработка и оптимизация моделей машинного обучения для анализа медицинских изображений.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'Deep Learning']
    }
  ],
  updates: [
    {
      id: 'update1',
      title: 'Завершено обучение новой модели',
      content: 'Мы завершили обучение новой модели, которая показывает точность 97% на тестовом наборе данных.',
      date: new Date('2025-09-01')
    },
    {
      id: 'update2',
      title: 'Партнерство с клиникой "МедЦентр"',
      content: 'Мы заключили партнерство с сетью клиник "МедЦентр" для пилотного внедрения нашей системы.',
      date: new Date('2025-08-15')
    }
  ],
  createdAt: new Date('2025-08-10')
};

const StartupDetail: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [startup, setStartup] = useState(MOCK_STARTUP);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'updates' | 'jobs'>('overview');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentMessage, setInvestmentMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setStartup(MOCK_STARTUP);
      setLoading(false);
    }, 500);
  }, [startupId]);
  
  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Форматирование суммы
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Расчет процента финансирования
  const calculateFundingPercentage = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };
  
  // Стадии для отображения
  const stages = [
    { id: 'idea', name: 'Идея' },
    { id: 'mvp', name: 'MVP' },
    { id: 'early-growth', name: 'Ранний рост' },
    { id: 'scaling', name: 'Масштабирование' },
    { id: 'established', name: 'Устоявшийся бизнес' }
  ];
  
  // Отправка инвестиционного предложения
  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!investmentAmount.trim()) {
      newErrors.amount = 'Укажите сумму инвестиции';
    } else if (isNaN(Number(investmentAmount)) || Number(investmentAmount) <= 0) {
      newErrors.amount = 'Сумма должна быть положительным числом';
    } else if (Number(investmentAmount) < startup.funding.minInvestment) {
      newErrors.amount = `Минимальная сумма инвестиции: ${formatCurrency(startup.funding.minInvestment, startup.funding.currency)}`;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    setSubmitting(true);
    
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link 
              to="/startups" 
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к стартапам</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-purple-500 to-blue-500 relative">
        {startup.coverImage ? (
          <img 
            src={startup.coverImage} 
            alt={startup.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-20 h-20 text-white" />
          </div>
        )}
        
        {/* Logo */}
        <div className="absolute -bottom-16 left-8 w-32 h-32 bg-dark-800 rounded-xl border-4 border-dark-900 flex items-center justify-center">
          {startup.logo ? (
            <img 
              src={startup.logo} 
              alt={startup.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <TrendingUp className="w-16 h-16 text-primary-400" />
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Startup Info */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">{startup.name}</h1>
                  <p className="text-gray-300 text-lg mt-1">{startup.tagline}</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                    {stages.find(s => s.id === startup.stage)?.name || startup.stage}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{startup.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Основан {formatDate(startup.foundedAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{startup.teamSize} в команде</span>
                </div>
                
                {startup.website && (
                  <a 
                    href={startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Веб-сайт</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-dark-700 mb-6">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Обзор
                </button>
                
                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'team'
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Команда
                </button>
                
                <button
                  onClick={() => setActiveTab('updates')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'updates'
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Обновления
                </button>
                
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'jobs'
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Вакансии
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">О проекте</h2>
                  <div 
                    className="text-gray-300 space-y-4 startup-description"
                    dangerouslySetInnerHTML={{ __html: startup.description }}
                  />
                  
                  {/* Documents */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white mb-3">Документы</h3>
                    <div className="space-y-3">
                      {startup.pitchDeck && (
                        <a 
                          href={startup.pitchDeck}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-primary-400 mr-3" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">Презентация</p>
                            <p className="text-gray-400 text-xs">Pitch Deck (PDF)</p>
                          </div>
                          <span className="text-primary-400 text-sm">Скачать</span>
                        </a>
                      )}
                      
                      {startup.businessPlan && (
                        <a 
                          href={startup.businessPlan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-primary-400 mr-3" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">Бизнес-план</p>
                            <p className="text-gray-400 text-xs">Business Plan (PDF)</p>
                          </div>
                          <span className="text-primary-400 text-sm">Скачать</span>
                        </a>
                      )}
                      
                      {startup.demoVideo && (
                        <a 
                          href={startup.demoVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-primary-400 mr-3" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">Демо-видео</p>
                            <p className="text-gray-400 text-xs">Demo Video (MP4)</p>
                          </div>
                          <span className="text-primary-400 text-sm">Смотреть</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  {startup.metrics && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-white mb-3">Метрики</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {startup.metrics.users && (
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Пользователи</p>
                            <p className="text-white text-xl font-semibold">{startup.metrics.users}</p>
                          </div>
                        )}
                        
                        {startup.metrics.growth && (
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Рост</p>
                            <p className="text-green-400 text-xl font-semibold">+{startup.metrics.growth}%</p>
                          </div>
                        )}
                        
                        {startup.metrics.revenue && (
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Выручка</p>
                            <p className="text-white text-xl font-semibold">{formatCurrency(startup.metrics.revenue, startup.funding.currency)}</p>
                          </div>
                        )}
                        
                        {startup.metrics.churn && (
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Отток</p>
                            <p className="text-red-400 text-xl font-semibold">{startup.metrics.churn}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Team Tab */}
              {activeTab === 'team' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Команда</h2>
                  
                  {/* Founder */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-3">Основатель</h3>
                    <div className="bg-dark-700 rounded-lg p-4 flex items-start">
                      <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mr-4">
                        {startup.founderAvatar ? (
                          <img 
                            src={startup.founderAvatar} 
                            alt={startup.founderName} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-primary-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{startup.founderName}</h4>
                        <p className="text-primary-400 text-sm">Основатель & CEO</p>
                        <p className="text-gray-300 mt-2">{startup.founderBio}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Члены команды</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {startup.team.map(member => (
                        <div key={member.id} className="bg-dark-700 rounded-lg p-4 flex items-center">
                          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mr-3">
                            {member.avatar ? (
                              <img 
                                src={member.avatar} 
                                alt={member.name} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-primary-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{member.name}</h4>
                            <p className="text-gray-400 text-sm">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Обновления</h2>
                  
                  <div className="space-y-6">
                    {startup.updates.map(update => (
                      <div key={update.id} className="border-b border-dark-700 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-white">{update.title}</h3>
                          <span className="text-gray-400 text-sm">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-gray-300">{update.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Вакансии</h2>
                  
                  {startup.jobs.length > 0 ? (
                    <div className="space-y-4">
                      {startup.jobs.map(job => (
                        <div key={job.id} className="bg-dark-700 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                            <h3 className="text-white font-medium">{job.title}</h3>
                            <div className="flex items-center space-x-3 mt-2 md:mt-0">
                              <span className="bg-primary-500/10 text-primary-400 px-2 py-1 rounded text-xs">
                                {job.type === 'full-time' ? 'Полный день' : 
                                 job.type === 'part-time' ? 'Частичная занятость' : 
                                 job.type === 'contract' ? 'Контракт' : 
                                 job.type === 'internship' ? 'Стажировка' : 
                                 job.type === 'equity' ? 'За долю' : job.type}
                              </span>
                              <span className="bg-dark-600 text-gray-300 px-2 py-1 rounded text-xs">
                                {job.remote ? 'Удаленно' : job.location}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-3">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className="bg-dark-600 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          <button className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
                            Подать заявку
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">В настоящее время нет открытых вакансий.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span>В избранное</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Поделиться</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>Связаться</span>
              </button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Funding */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Финансирование</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">Цель</span>
                    <span className="text-white font-medium">{formatCurrency(startup.funding.goal, startup.funding.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">Собрано</span>
                    <span className="text-white font-medium">{formatCurrency(startup.funding.raised, startup.funding.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">Доля</span>
                    <span className="text-white font-medium">{startup.funding.equityOffered}%</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">Мин. инвестиция</span>
                    <span className="text-white font-medium">{formatCurrency(startup.funding.minInvestment, startup.funding.currency)}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300">Прогресс</span>
                      <span className="text-white font-medium">
                        {calculateFundingPercentage(startup.funding.raised, startup.funding.goal)}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${calculateFundingPercentage(startup.funding.raised, startup.funding.goal)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Investment Form */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Инвестировать</h2>
              
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-4">Для инвестирования необходимо войти в систему</p>
                  <Link to="/auth" className="btn btn-primary">
                    Войти
                  </Link>
                </div>
              ) : submitted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Предложение отправлено!</h3>
                  <p className="text-gray-300">
                    Ваше инвестиционное предложение успешно отправлено основателю стартапа. Вы получите уведомление, когда оно будет рассмотрено.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInvestmentSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="investmentAmount" className="block text-white mb-2">Сумма инвестиции*</label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="investmentAmount"
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            placeholder={`Мин. ${startup.funding.minInvestment}`}
                            className={`w-full bg-dark-700 border ${errors.amount ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          />
                        </div>
                        <div className="bg-dark-700 border border-dark-600 rounded-r-lg px-3 flex items-center text-white">
                          {startup.funding.currency}
                        </div>
                      </div>
                      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="investmentMessage" className="block text-white mb-2">Сообщение (необязательно)</label>
                      <textarea
                        id="investmentMessage"
                        value={investmentMessage}
                        onChange={(e) => setInvestmentMessage(e.target.value)}
                        placeholder="Расскажите, почему вы хотите инвестировать в этот стартап..."
                        rows={4}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="bg-dark-700 rounded-lg p-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">
                        Инвестирование в стартапы связано с высоким риском. Не инвестируйте средства, которые вы не готовы потерять.
                      </p>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Отправка...' : 'Отправить предложение'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Founder */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Основатель</h2>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mr-3">
                  {startup.founderAvatar ? (
                    <img 
                      src={startup.founderAvatar} 
                      alt={startup.founderName} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-primary-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium">{startup.founderName}</h3>
                  <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                    Посмотреть профиль
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-dark-700">
                <button className="w-full btn btn-secondary">
                  Связаться с основателем
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
