import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Briefcase, DollarSign, Clock, Tag, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Временная заглушка для данных
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Разработка мобильного приложения для фитнеса',
    description: 'Требуется разработать мобильное приложение для отслеживания тренировок и питания с интеграцией с фитнес-трекерами.',
    category: 'Mobile Development',
    skills: ['React Native', 'TypeScript', 'Firebase', 'UI/UX'],
    budget: {
      min: 1500,
      max: 3000,
      currency: 'USD'
    },
    deadline: new Date('2026-01-15'),
    clientId: 'client1',
    clientName: 'TechFit Inc.',
    clientAvatar: '',
    status: 'open',
    proposals: 7,
    createdAt: new Date('2025-10-15')
  },
  {
    id: '2',
    title: 'Редизайн корпоративного сайта',
    description: 'Необходимо обновить дизайн и функциональность существующего корпоративного сайта на WordPress.',
    category: 'Web Design',
    skills: ['WordPress', 'HTML/CSS', 'JavaScript', 'Responsive Design'],
    budget: {
      fixed: 1200,
      currency: 'USD'
    },
    deadline: new Date('2025-12-20'),
    clientId: 'client2',
    clientName: 'Global Solutions Ltd.',
    clientAvatar: '',
    status: 'open',
    proposals: 12,
    createdAt: new Date('2025-10-10')
  },
  {
    id: '3',
    title: 'Разработка API для платежной системы',
    description: 'Требуется разработать безопасный API для интеграции с различными платежными шлюзами.',
    category: 'Backend Development',
    skills: ['Node.js', 'Express', 'MongoDB', 'Payment Gateways', 'Security'],
    budget: {
      hourlyRate: 40,
      currency: 'USD'
    },
    deadline: new Date('2025-11-30'),
    clientId: 'client3',
    clientName: 'FinTech Solutions',
    clientAvatar: '',
    status: 'open',
    proposals: 5,
    createdAt: new Date('2025-10-05')
  }
];

const FreelanceJobs: React.FC = () => {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuthStore();
  
  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setJobs(MOCK_JOBS);
      setLoading(false);
    }, 500);
  }, []);
  
  // Фильтрация заказов
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Категории для фильтрации
  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'Web Development', name: 'Веб-разработка' },
    { id: 'Mobile Development', name: 'Мобильная разработка' },
    { id: 'Web Design', name: 'Веб-дизайн' },
    { id: 'Backend Development', name: 'Бэкенд разработка' },
    { id: 'Frontend Development', name: 'Фронтенд разработка' },
    { id: 'UI/UX Design', name: 'UI/UX дизайн' }
  ];
  
  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Фриланс заказы</h1>
              <p className="text-gray-400 mt-1">Найдите подходящие проекты для ваших навыков</p>
            </div>
            
            {isAuthenticated && (
              <Link 
                to="/create-freelance-job" 
                className="mt-4 md:mt-0 btn btn-primary"
              >
                Разместить заказ
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
                placeholder="Поиск заказов..."
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
            
            {/* Quick category filters */}
            <div className="hidden md:flex space-x-2 overflow-x-auto">
              {categories.slice(0, 4).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Extended filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-dark-700 rounded-xl border border-dark-600">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="text-white font-medium mb-3">Категории</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="text-primary-500"
                        />
                        <span className="text-gray-300 text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Budget Range */}
                <div>
                  <h4 className="text-white font-medium mb-3">Бюджет</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="budget"
                        className="text-primary-500"
                      />
                      <span className="text-gray-300 text-sm">Любой бюджет</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="budget"
                        className="text-primary-500"
                      />
                      <span className="text-gray-300 text-sm">$0 - $500</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="budget"
                        className="text-primary-500"
                      />
                      <span className="text-gray-300 text-sm">$500 - $1000</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="budget"
                        className="text-primary-500"
                      />
                      <span className="text-gray-300 text-sm">$1000 - $5000</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="budget"
                        className="text-primary-500"
                      />
                      <span className="text-gray-300 text-sm">$5000+</span>
                    </label>
                  </div>
                </div>
                
                {/* Skills */}
                <div>
                  <h4 className="text-white font-medium mb-3">Популярные навыки</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'TypeScript', 'UI/UX', 'Python', 'WordPress'].map(skill => (
                      <button
                        key={skill}
                        className="px-2 py-1 rounded text-xs bg-dark-600 text-gray-400 hover:text-white transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Jobs List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <Link to={`/freelance-jobs/${job.id}`} className="group">
                      <h2 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {job.title}
                      </h2>
                    </Link>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-gray-400 text-sm">{job.clientName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">Опубликовано {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                      {job.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-dark-700 text-gray-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-dark-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">
                        {job.budget.fixed 
                          ? `${job.budget.fixed} ${job.budget.currency}`
                          : job.budget.hourlyRate
                            ? `${job.budget.hourlyRate} ${job.budget.currency}/час`
                            : `${job.budget.min} - ${job.budget.max} ${job.budget.currency}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Дедлайн: {formatDate(job.deadline)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{job.proposals} предложений</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/freelance-jobs/${job.id}`}
                    className="mt-4 sm:mt-0 flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <span>Подробнее</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Заказы не найдены</h3>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска или фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelanceJobs;
