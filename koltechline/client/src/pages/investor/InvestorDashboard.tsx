import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart, 
  Briefcase, 
  Users, 
  Star, 
  ChevronRight,
  Search,
  Filter,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Временная заглушка для данных
const MOCK_INVESTMENTS = [
  {
    id: '1',
    startupId: '1',
    startupName: 'HealthTech AI',
    startupLogo: '',
    industry: 'Healthcare',
    amount: 50000,
    currency: 'USD',
    equity: 5,
    date: new Date('2025-08-15'),
    status: 'active',
    valuation: 1000000,
    currentValue: 65000,
    growth: 30
  },
  {
    id: '2',
    startupId: '3',
    startupName: 'FinLiteracy',
    startupLogo: '',
    industry: 'EdTech',
    amount: 25000,
    currency: 'USD',
    equity: 2.5,
    date: new Date('2025-09-10'),
    status: 'active',
    valuation: 1200000,
    currentValue: 30000,
    growth: 20
  }
];

const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    startupId: '2',
    startupName: 'EcoDelivery',
    startupLogo: '',
    industry: 'Logistics',
    tagline: 'Экологичная доставка на электротранспорте',
    stage: 'mvp',
    goal: 300000,
    raised: 50000,
    currency: 'USD',
    equityOffered: 10,
    minInvestment: 10000,
    matchScore: 85
  },
  {
    id: '2',
    startupId: '4',
    startupName: 'SmartHome OS',
    startupLogo: '',
    industry: 'IoT',
    tagline: 'Операционная система для умного дома',
    stage: 'early-growth',
    goal: 500000,
    raised: 200000,
    currency: 'USD',
    equityOffered: 15,
    minInvestment: 20000,
    matchScore: 75
  },
  {
    id: '3',
    startupId: '5',
    startupName: 'CryptoPayments',
    startupLogo: '',
    industry: 'FinTech',
    tagline: 'Платежная система на блокчейне',
    stage: 'scaling',
    goal: 1000000,
    raised: 600000,
    currency: 'USD',
    equityOffered: 8,
    minInvestment: 50000,
    matchScore: 65
  }
];

const MOCK_PORTFOLIO_STATS = {
  totalInvested: 75000,
  currentValue: 95000,
  totalReturn: 26.67,
  numberOfInvestments: 2,
  industries: [
    { name: 'Healthcare', percentage: 60 },
    { name: 'EdTech', percentage: 40 }
  ]
};

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'update',
    startupId: '1',
    startupName: 'HealthTech AI',
    message: 'Опубликовано новое обновление: "Завершено обучение новой модели"',
    date: new Date('2025-10-01'),
    read: false
  },
  {
    id: '2',
    type: 'milestone',
    startupId: '3',
    startupName: 'FinLiteracy',
    message: 'Достигнута веха: 15,000 пользователей',
    date: new Date('2025-09-25'),
    read: true
  },
  {
    id: '3',
    type: 'opportunity',
    startupId: '2',
    startupName: 'EcoDelivery',
    message: 'Новая инвестиционная возможность, соответствующая вашим предпочтениям',
    date: new Date('2025-09-20'),
    read: false
  }
];

const InvestorDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [investments, setInvestments] = useState(MOCK_INVESTMENTS);
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [portfolioStats, setPortfolioStats] = useState(MOCK_PORTFOLIO_STATS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'opportunities' | 'analytics'>('portfolio');
  
  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setInvestments(MOCK_INVESTMENTS);
      setOpportunities(MOCK_OPPORTUNITIES);
      setPortfolioStats(MOCK_PORTFOLIO_STATS);
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
    }, 500);
  }, []);
  
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
  
  // Отметить уведомление как прочитанное
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };
  
  // Проверка авторизации
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Требуется авторизация</h2>
          <p className="text-gray-300 mb-6">
            Для доступа к панели инвестора необходимо войти в систему или зарегистрироваться.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn btn-primary">
              Войти
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Панель инвестора</h1>
              <p className="text-gray-400 mt-1">Управляйте своими инвестициями и находите новые возможности</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 bg-dark-700 rounded-full text-gray-300 hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
              
              {/* Profile */}
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-white">{user?.name || 'Инвестор'}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Portfolio Summary */}
      <div className="bg-dark-800/50 border-b border-dark-700 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Общие инвестиции</p>
              <p className="text-white text-2xl font-semibold">{formatCurrency(portfolioStats.totalInvested, 'USD')}</p>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Текущая стоимость</p>
              <p className="text-white text-2xl font-semibold">{formatCurrency(portfolioStats.currentValue, 'USD')}</p>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Общая доходность</p>
              <p className={`text-2xl font-semibold ${portfolioStats.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioStats.totalReturn >= 0 ? '+' : ''}{portfolioStats.totalReturn}%
              </p>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Количество инвестиций</p>
              <p className="text-white text-2xl font-semibold">{portfolioStats.numberOfInvestments}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="border-b border-dark-700 mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Портфель
            </button>
            
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'opportunities'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Возможности
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Аналитика
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Мои инвестиции</h2>
              <Link 
                to="/startups" 
                className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
              >
                Найти новые стартапы
              </Link>
            </div>
            
            {investments.length > 0 ? (
              <div className="space-y-6">
                {investments.map(investment => (
                  <div 
                    key={investment.id} 
                    className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4">
                          {investment.startupLogo ? (
                            <img 
                              src={investment.startupLogo} 
                              alt={investment.startupName} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <TrendingUp className="w-6 h-6 text-primary-400" />
                          )}
                        </div>
                        <div>
                          <Link to={`/startups/${investment.startupId}`} className="group">
                            <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                              {investment.startupName}
                            </h3>
                          </Link>
                          <p className="text-gray-400 text-sm">{investment.industry}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <div className={`flex items-center space-x-2 ${investment.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4 transform rotate-180" />
                          )}
                          <span className="font-medium">
                            {investment.growth >= 0 ? '+' : ''}{investment.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Инвестировано</p>
                        <p className="text-white font-medium">{formatCurrency(investment.amount, investment.currency)}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">Текущая стоимость</p>
                        <p className="text-white font-medium">{formatCurrency(investment.currentValue, investment.currency)}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">Доля</p>
                        <p className="text-white font-medium">{investment.equity}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                      <p className="text-gray-400 text-sm">Инвестировано {formatDate(investment.date)}</p>
                      
                      <Link 
                        to={`/startups/${investment.startupId}`}
                        className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <span className="text-sm">Подробнее</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-800 border border-dark-700 rounded-xl">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">У вас пока нет инвестиций</h3>
                <p className="text-gray-400 mb-6">
                  Начните инвестировать в перспективные стартапы прямо сейчас
                </p>
                <Link to="/startups" className="btn btn-primary">
                  Найти стартапы
                </Link>
              </div>
            )}
            
            {/* Notifications */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-6">Уведомления</h2>
              
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`bg-dark-800 border ${notification.read ? 'border-dark-700' : 'border-primary-500/50'} rounded-xl p-4 hover:border-dark-600 transition-colors`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.read ? 'bg-gray-600' : 'bg-primary-500'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Link to={`/startups/${notification.startupId}`} className="text-white font-medium hover:text-primary-400 transition-colors">
                              {notification.startupName}
                            </Link>
                            <span className="text-gray-400 text-xs">{formatDate(notification.date)}</span>
                          </div>
                          <p className="text-gray-300">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-dark-800 border border-dark-700 rounded-xl">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">У вас нет новых уведомлений</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'opportunities' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Рекомендуемые стартапы</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-dark-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск..."
                    className="bg-dark-700 border border-dark-600 rounded-lg py-2 pl-9 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map(opportunity => (
                <div 
                  key={opportunity.id} 
                  className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-dark-600 transition-colors"
                >
                  {/* Match Score */}
                  <div className="bg-dark-700 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-white text-sm font-medium">Соответствие</span>
                    </div>
                    <span className="text-white font-medium">{opportunity.matchScore}%</span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center mr-3">
                        {opportunity.startupLogo ? (
                          <img 
                            src={opportunity.startupLogo} 
                            alt={opportunity.startupName} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-primary-400" />
                        )}
                      </div>
                      <div>
                        <Link to={`/startups/${opportunity.startupId}`} className="group">
                          <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {opportunity.startupName}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">{opportunity.industry}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400 text-xs">
                            {stages.find(s => s.id === opportunity.stage)?.name || opportunity.stage}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{opportunity.tagline}</p>
                    
                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">Финансирование</span>
                        <span className="text-white text-xs">
                          {formatCurrency(opportunity.raised, opportunity.currency)} / {formatCurrency(opportunity.goal, opportunity.currency)}
                        </span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-purple h-1.5 rounded-full"
                          style={{ width: `${calculateFundingPercentage(opportunity.raised, opportunity.goal)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>Доля: {opportunity.equityOffered}%</span>
                      <span>Мин: {formatCurrency(opportunity.minInvestment, opportunity.currency)}</span>
                    </div>
                    
                    <Link 
                      to={`/startups/${opportunity.startupId}`}
                      className="w-full btn btn-primary btn-sm"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/startups" 
                className="btn btn-secondary"
              >
                Смотреть все стартапы
              </Link>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Аналитика портфеля</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry Distribution */}
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Распределение по отраслям</h3>
                
                <div className="space-y-4">
                  {portfolioStats.industries.map((industry, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300">{industry.name}</span>
                        <span className="text-white">{industry.percentage}%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${industry.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <p className="text-gray-400 text-sm">
                    Рекомендация: Для лучшей диверсификации рассмотрите инвестиции в другие отрасли, такие как FinTech и AI/ML.
                  </p>
                </div>
              </div>
              
              {/* Performance */}
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Доходность инвестиций</h3>
                
                <div className="space-y-4">
                  {investments.map(investment => (
                    <div key={investment.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300">{investment.startupName}</span>
                        <span className={`font-medium ${investment.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.growth >= 0 ? '+' : ''}{investment.growth}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div 
                          className={`${investment.growth >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                          style={{ width: `${Math.abs(investment.growth)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Общая доходность</span>
                    <span className={`font-medium ${portfolioStats.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {portfolioStats.totalReturn >= 0 ? '+' : ''}{portfolioStats.totalReturn}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
