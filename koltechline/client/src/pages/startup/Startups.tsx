import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, DollarSign, Users, Tag, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Временная заглушка для данных
const MOCK_STARTUPS = [
  {
    id: '1',
    name: 'HealthTech AI',
    tagline: 'Искусственный интеллект для диагностики заболеваний',
    description: 'Мы разрабатываем систему на базе ИИ для ранней диагностики заболеваний по медицинским изображениям с точностью выше 95%.',
    industry: 'Healthcare',
    stage: 'early-growth',
    logo: '',
    founderId: 'founder1',
    founderName: 'Алексей Иванов',
    founderAvatar: '',
    teamSize: 5,
    funding: {
      goal: 500000,
      raised: 150000,
      currency: 'USD',
      equityOffered: 15
    },
    metrics: {
      users: 1200,
      growth: 25
    },
    location: 'Москва, Россия',
    createdAt: new Date('2025-08-10')
  },
  {
    id: '2',
    name: 'EcoDelivery',
    tagline: 'Экологичная доставка на электротранспорте',
    description: 'Сервис доставки, использующий только электрические транспортные средства, снижающий углеродный след и оптимизирующий маршруты с помощью ИИ.',
    industry: 'Logistics',
    stage: 'mvp',
    logo: '',
    founderId: 'founder2',
    founderName: 'Мария Петрова',
    founderAvatar: '',
    teamSize: 3,
    funding: {
      goal: 300000,
      raised: 50000,
      currency: 'USD',
      equityOffered: 10
    },
    metrics: {
      users: 500,
      growth: 40
    },
    location: 'Санкт-Петербург, Россия',
    createdAt: new Date('2025-09-05')
  },
  {
    id: '3',
    name: 'FinLiteracy',
    tagline: 'Финансовая грамотность для всех',
    description: 'Образовательная платформа, обучающая финансовой грамотности через интерактивные курсы, симуляции и персонализированные рекомендации.',
    industry: 'EdTech',
    stage: 'scaling',
    logo: '',
    founderId: 'founder3',
    founderName: 'Дмитрий Смирнов',
    founderAvatar: '',
    teamSize: 8,
    funding: {
      goal: 1000000,
      raised: 700000,
      currency: 'USD',
      equityOffered: 12
    },
    metrics: {
      users: 15000,
      growth: 60
    },
    location: 'Казань, Россия',
    createdAt: new Date('2025-07-20')
  }
];

const Startups: React.FC = () => {
  const [startups, setStartups] = useState(MOCK_STARTUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuthStore();
  
  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setStartups(MOCK_STARTUPS);
      setLoading(false);
    }, 500);
  }, []);
  
  // Фильтрация стартапов
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = 
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'all' || startup.industry === selectedIndustry;
    const matchesStage = selectedStage === 'all' || startup.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });
  
  // Отрасли для фильтрации
  const industries = [
    { id: 'all', name: 'Все отрасли' },
    { id: 'Healthcare', name: 'Здравоохранение' },
    { id: 'Logistics', name: 'Логистика' },
    { id: 'EdTech', name: 'Образование' },
    { id: 'FinTech', name: 'Финтех' },
    { id: 'E-commerce', name: 'Электронная коммерция' },
    { id: 'AI/ML', name: 'Искусственный интеллект' }
  ];
  
  // Стадии для фильтрации
  const stages = [
    { id: 'all', name: 'Все стадии' },
    { id: 'idea', name: 'Идея' },
    { id: 'mvp', name: 'MVP' },
    { id: 'early-growth', name: 'Ранний рост' },
    { id: 'scaling', name: 'Масштабирование' },
    { id: 'established', name: 'Устоявшийся бизнес' }
  ];
  
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

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Стартапы</h1>
              <p className="text-gray-400 mt-1">Найдите перспективные проекты для инвестиций или присоединения к команде</p>
            </div>
            
            {isAuthenticated && (
              <Link 
                to="/create-startup" 
                className="mt-4 md:mt-0 btn btn-primary"
              >
                Добавить стартап
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Search and Filters */}
      <div className="bg-dark-800/50 border-b border-dark-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск стартапов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </button>
            
            {/* Quick industry filters */}
            <div className="hidden md:flex space-x-2 overflow-x-auto">
              {industries.slice(0, 4).map(industry => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedIndustry === industry.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Extended filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-dark-700 rounded-xl border border-dark-600">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Industries */}
                <div>
                  <h4 className="text-white font-medium mb-3">Отрасли</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.map(industry => (
                      <label key={industry.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="industry"
                          checked={selectedIndustry === industry.id}
                          onChange={() => setSelectedIndustry(industry.id)}
                          className="text-primary-500"
                        />
                        <span className="text-gray-300 text-sm">{industry.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Stages */}
                <div>
                  <h4 className="text-white font-medium mb-3">Стадия развития</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {stages.map(stage => (
                      <label key={stage.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="stage"
                          checked={selectedStage === stage.id}
                          onChange={() => setSelectedStage(stage.id)}
                          className="text-primary-500"
                        />
                        <span className="text-gray-300 text-sm">{stage.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Startups List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map(startup => (
              <div 
                key={startup.id} 
                className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden hover:border-dark-600 transition-colors"
              >
                {/* Logo/Header */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 relative">
                  {startup.logo ? (
                    <img 
                      src={startup.logo} 
                      alt={startup.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TrendingUp className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  {/* Stage Badge */}
                  <div className="absolute top-4 right-4 bg-dark-900/80 text-white text-xs px-2 py-1 rounded-full">
                    {stages.find(s => s.id === startup.stage)?.name || startup.stage}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <Link to={`/startups/${startup.id}`} className="group">
                    <h2 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {startup.name}
                    </h2>
                  </Link>
                  <p className="text-gray-300 mt-1">{startup.tagline}</p>
                  
                  {/* Industry & Location */}
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="text-gray-400 text-sm">{industries.find(i => i.id === startup.industry)?.name || startup.industry}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-sm">{startup.location}</span>
                  </div>
                  
                  {/* Funding Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">Финансирование</span>
                      <span className="text-white text-sm">
                        {formatCurrency(startup.funding.raised, startup.funding.currency)} / {formatCurrency(startup.funding.goal, startup.funding.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-purple h-2 rounded-full"
                        style={{ width: `${calculateFundingPercentage(startup.funding.raised, startup.funding.goal)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-xs">{calculateFundingPercentage(startup.funding.raised, startup.funding.goal)}%</span>
                      <span className="text-gray-400 text-xs">{startup.funding.equityOffered}% equity</span>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{startup.teamSize} в команде</span>
                    </div>
                    
                    {startup.metrics?.users && (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">{startup.metrics.users} пользователей</span>
                      </div>
                    )}
                    
                    {startup.metrics?.growth && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{startup.metrics.growth}% рост</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-primary-400" />
                      </div>
                      <span className="text-gray-400 text-sm">{startup.founderName}</span>
                    </div>
                    
                    <Link 
                      to={`/startups/${startup.id}`}
                      className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <span className="text-sm">Подробнее</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Стартапы не найдены</h3>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Startups;
