import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  Tag, 
  Upload, 
  Plus, 
  X,
  FileText,
  CheckCircle,
  Users,
  Globe,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CreateStartup: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  // Состояние формы
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [teamMembers, setTeamMembers] = useState<Array<{name: string, role: string}>>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [equityOffered, setEquityOffered] = useState('');
  const [minInvestment, setMinInvestment] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  // Состояние отправки
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Проверка авторизации
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Требуется авторизация</h2>
          <p className="text-gray-300 mb-6">
            Для добавления стартапа необходимо войти в систему или зарегистрироваться.
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
  
  // Отрасли для выбора
  const industries = [
    { id: 'Healthcare', name: 'Здравоохранение' },
    { id: 'Logistics', name: 'Логистика' },
    { id: 'EdTech', name: 'Образование' },
    { id: 'FinTech', name: 'Финтех' },
    { id: 'E-commerce', name: 'Электронная коммерция' },
    { id: 'AI/ML', name: 'Искусственный интеллект' },
    { id: 'Blockchain', name: 'Блокчейн' },
    { id: 'IoT', name: 'Интернет вещей' },
    { id: 'CleanTech', name: 'Чистые технологии' },
    { id: 'FoodTech', name: 'Пищевые технологии' },
    { id: 'Other', name: 'Другое' }
  ];
  
  // Стадии для выбора
  const stages = [
    { id: 'idea', name: 'Идея' },
    { id: 'mvp', name: 'MVP' },
    { id: 'early-growth', name: 'Ранний рост' },
    { id: 'scaling', name: 'Масштабирование' },
    { id: 'established', name: 'Устоявшийся бизнес' }
  ];
  
  // Валюты для выбора
  const currencies = [
    { code: 'USD', symbol: '$', name: 'Доллар США' },
    { code: 'EUR', symbol: '€', name: 'Евро' },
    { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
    { code: 'GBP', symbol: '£', name: 'Фунт стерлингов' },
    { code: 'CNY', symbol: '¥', name: 'Китайский юань' }
  ];
  
  // Добавление члена команды
  const handleAddTeamMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      setTeamMembers([...teamMembers, {
        name: newMemberName.trim(),
        role: newMemberRole.trim()
      }]);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };
  
  // Удаление члена команды
  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };
  
  // Обработка загрузки логотипа
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };
  
  // Обработка загрузки обложки
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };
  
  // Обработка загрузки файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  // Удаление файла
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Название стартапа обязательно';
    if (!tagline.trim()) newErrors.tagline = 'Краткое описание обязательно';
    if (!description.trim()) newErrors.description = 'Описание стартапа обязательно';
    if (!industry) newErrors.industry = 'Выберите отрасль';
    if (!stage) newErrors.stage = 'Выберите стадию развития';
    if (!location.trim()) newErrors.location = 'Укажите местоположение';
    if (!teamSize.trim()) newErrors.teamSize = 'Укажите размер команды';
    else if (isNaN(Number(teamSize)) || Number(teamSize) <= 0) {
      newErrors.teamSize = 'Размер команды должен быть положительным числом';
    }
    
    if (website.trim() && !website.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/)) {
      newErrors.website = 'Введите корректный URL';
    }
    
    if (!fundingGoal.trim()) newErrors.fundingGoal = 'Укажите цель финансирования';
    else if (isNaN(Number(fundingGoal)) || Number(fundingGoal) <= 0) {
      newErrors.fundingGoal = 'Цель должна быть положительным числом';
    }
    
    if (!equityOffered.trim()) newErrors.equityOffered = 'Укажите предлагаемую долю';
    else if (isNaN(Number(equityOffered)) || Number(equityOffered) <= 0 || Number(equityOffered) > 100) {
      newErrors.equityOffered = 'Доля должна быть положительным числом не более 100%';
    }
    
    if (!minInvestment.trim()) newErrors.minInvestment = 'Укажите минимальную инвестицию';
    else if (isNaN(Number(minInvestment)) || Number(minInvestment) <= 0) {
      newErrors.minInvestment = 'Минимальная инвестиция должна быть положительным числом';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    // Формирование данных для отправки
    const startupData = {
      name,
      tagline,
      description,
      industry,
      stage,
      location,
      website,
      teamSize: Number(teamSize),
      team: teamMembers,
      funding: {
        goal: Number(fundingGoal),
        raised: 0,
        currency,
        equityOffered: Number(equityOffered),
        minInvestment: Number(minInvestment)
      }
    };
    
    // В реальном приложении здесь будет API запрос
    console.log('Отправка данных:', startupData);
    console.log('Логотип:', logo);
    console.log('Обложка:', coverImage);
    console.log('Файлы:', files);
    
    // Имитация отправки
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };
  
  // Если стартап успешно создан
  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-dark-800 border border-dark-700 rounded-xl p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Стартап успешно создан!</h1>
            <p className="text-gray-300 mb-8">
              Ваш стартап был успешно опубликован и теперь доступен для инвесторов и потенциальных участников команды.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/startups" className="btn btn-primary">
                Вернуться к списку стартапов
              </Link>
              <button 
                onClick={() => navigate('/profile')} 
                className="btn btn-secondary"
              >
                Перейти в профиль
              </button>
            </div>
          </div>
        </div>
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
            
            <h1 className="text-2xl font-bold text-white">Добавление нового стартапа</h1>
          </div>
        </div>
      </header>
      
      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Основная информация</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Название стартапа*</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: HealthTech AI"
                    className={`w-full bg-dark-700 border ${errors.name ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                {/* Tagline */}
                <div>
                  <label htmlFor="tagline" className="block text-white mb-2">Краткое описание (tagline)*</label>
                  <input
                    id="tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Например: Искусственный интеллект для диагностики заболеваний"
                    className={`w-full bg-dark-700 border ${errors.tagline ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-white mb-2">Описание стартапа*</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Подробно опишите ваш стартап, проблему, которую он решает, и ваше решение..."
                    rows={8}
                    className={`w-full bg-dark-700 border ${errors.description ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  <p className="text-gray-400 text-sm mt-1">
                    Вы можете использовать HTML-теги для форматирования текста.
                  </p>
                </div>
                
                {/* Industry & Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-white mb-2">Отрасль*</label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className={`w-full bg-dark-700 border ${errors.industry ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    >
                      <option value="">Выберите отрасль</option>
                      {industries.map((ind) => (
                        <option key={ind.id} value={ind.id}>{ind.name}</option>
                      ))}
                    </select>
                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                  </div>
                  
                  {/* Stage */}
                  <div>
                    <label htmlFor="stage" className="block text-white mb-2">Стадия развития*</label>
                    <select
                      id="stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className={`w-full bg-dark-700 border ${errors.stage ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    >
                      <option value="">Выберите стадию</option>
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    {errors.stage && <p className="text-red-500 text-sm mt-1">{errors.stage}</p>}
                  </div>
                </div>
                
                {/* Location & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-white mb-2">Местоположение*</label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Например: Москва, Россия"
                      className={`w-full bg-dark-700 border ${errors.location ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  
                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-white mb-2">Веб-сайт</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="website"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className={`w-full bg-dark-700 border ${errors.website ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      />
                    </div>
                    {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Команда</h2>
              
              <div className="space-y-6">
                {/* Team Size */}
                <div>
                  <label htmlFor="teamSize" className="block text-white mb-2">Размер команды*</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="teamSize"
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="Количество человек"
                      className={`w-full bg-dark-700 border ${errors.teamSize ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                  </div>
                  {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>}
                </div>
                
                {/* Team Members */}
                <div>
                  <label className="block text-white mb-2">Члены команды</label>
                  
                  {/* Team Members List */}
                  {teamMembers.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {teamMembers.map((member, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-dark-700 rounded-lg p-3"
                        >
                          <div>
                            <p className="text-white">{member.name}</p>
                            <p className="text-gray-400 text-sm">{member.role}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveTeamMember(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Team Member */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Имя"
                      className="bg-dark-700 border border-dark-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      placeholder="Должность"
                      className="bg-dark-700 border border-dark-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить члена команды</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Funding */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Финансирование</h2>
              
              <div className="space-y-6">
                {/* Funding Goal */}
                <div>
                  <label htmlFor="fundingGoal" className="block text-white mb-2">Цель финансирования*</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="fundingGoal"
                        type="number"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="Введите сумму"
                        className={`w-full bg-dark-700 border ${errors.fundingGoal ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      />
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-dark-700 border border-dark-600 rounded-r-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>{curr.code}</option>
                      ))}
                    </select>
                  </div>
                  {errors.fundingGoal && <p className="text-red-500 text-sm mt-1">{errors.fundingGoal}</p>}
                </div>
                
                {/* Equity Offered */}
                <div>
                  <label htmlFor="equityOffered" className="block text-white mb-2">Предлагаемая доля (%)*</label>
                  <input
                    id="equityOffered"
                    type="number"
                    value={equityOffered}
                    onChange={(e) => setEquityOffered(e.target.value)}
                    placeholder="Например: 15"
                    className={`w-full bg-dark-700 border ${errors.equityOffered ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.equityOffered && <p className="text-red-500 text-sm mt-1">{errors.equityOffered}</p>}
                </div>
                
                {/* Min Investment */}
                <div>
                  <label htmlFor="minInvestment" className="block text-white mb-2">Минимальная инвестиция*</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="minInvestment"
                        type="number"
                        value={minInvestment}
                        onChange={(e) => setMinInvestment(e.target.value)}
                        placeholder="Введите сумму"
                        className={`w-full bg-dark-700 border ${errors.minInvestment ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      />
                    </div>
                    <select
                      value={currency}
                      disabled
                      className="bg-dark-700 border border-dark-600 rounded-r-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={currency}>{currency}</option>
                    </select>
                  </div>
                  {errors.minInvestment && <p className="text-red-500 text-sm mt-1">{errors.minInvestment}</p>}
                </div>
              </div>
            </div>
            
            {/* Media */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Медиа</h2>
              
              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <label className="block text-white mb-2">Логотип</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-dark-700 rounded-lg flex items-center justify-center">
                      {logo ? (
                        <img 
                          src={URL.createObjectURL(logo)} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Briefcase className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Загрузить логотип</span>
                      </label>
                      <p className="text-gray-400 text-xs mt-1">
                        Рекомендуемый размер: 512x512px, до 2MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cover Image */}
                <div>
                  <label className="block text-white mb-2">Обложка</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-16 bg-dark-700 rounded-lg flex items-center justify-center">
                      {coverImage ? (
                        <img 
                          src={URL.createObjectURL(coverImage)} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img 
                          src="/placeholder-cover.jpg" 
                          alt="Cover placeholder" 
                          className="w-full h-full object-cover rounded-lg opacity-50"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.className = 'hidden';
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label 
                        htmlFor="cover-upload"
                        className="cursor-pointer bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Загрузить обложку</span>
                      </label>
                      <p className="text-gray-400 text-xs mt-1">
                        Рекомендуемый размер: 1200x630px, до 5MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Files */}
                <div>
                  <label className="block text-white mb-2">Документы</label>
                  
                  {/* Files List */}
                  {files.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-dark-700 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-white">{file.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Files */}
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="files-upload"
                    />
                    <label 
                      htmlFor="files-upload"
                      className="cursor-pointer bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Загрузить документы</span>
                    </label>
                    <p className="text-gray-400 text-xs mt-1">
                      Бизнес-план, презентация, финансовая модель и т.д. (до 10MB каждый)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link 
                to="/startups" 
                className="btn btn-secondary"
              >
                Отмена
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Создание...' : 'Создать стартап'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStartup;
