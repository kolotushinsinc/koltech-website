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
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CreateFreelanceJob: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  // Состояние формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'range' | 'hourly'>('fixed');
  const [budgetFixed, setBudgetFixed] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [budgetHourly, setBudgetHourly] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [deadline, setDeadline] = useState('');
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
            Для размещения заказа необходимо войти в систему или зарегистрироваться.
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
  
  // Категории для выбора
  const categories = [
    { id: 'Web Development', name: 'Веб-разработка' },
    { id: 'Mobile Development', name: 'Мобильная разработка' },
    { id: 'Web Design', name: 'Веб-дизайн' },
    { id: 'Backend Development', name: 'Бэкенд разработка' },
    { id: 'Frontend Development', name: 'Фронтенд разработка' },
    { id: 'UI/UX Design', name: 'UI/UX дизайн' },
    { id: 'Data Science', name: 'Наука о данных' },
    { id: 'DevOps', name: 'DevOps' },
    { id: 'QA Testing', name: 'Тестирование' },
    { id: 'Content Writing', name: 'Копирайтинг' },
    { id: 'Translation', name: 'Перевод' },
    { id: 'Marketing', name: 'Маркетинг' },
    { id: 'SEO', name: 'SEO' },
    { id: 'Other', name: 'Другое' }
  ];
  
  // Валюты для выбора
  const currencies = [
    { code: 'USD', symbol: '$', name: 'Доллар США' },
    { code: 'EUR', symbol: '€', name: 'Евро' },
    { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
    { code: 'GBP', symbol: '£', name: 'Фунт стерлингов' },
    { code: 'CNY', symbol: '¥', name: 'Китайский юань' }
  ];
  
  // Добавление навыка
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  // Удаление навыка
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
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
    
    if (!title.trim()) newErrors.title = 'Название заказа обязательно';
    if (!description.trim()) newErrors.description = 'Описание заказа обязательно';
    if (!category) newErrors.category = 'Выберите категорию';
    if (skills.length === 0) newErrors.skills = 'Добавьте хотя бы один навык';
    
    if (budgetType === 'fixed') {
      if (!budgetFixed.trim()) newErrors.budgetFixed = 'Укажите бюджет';
      else if (isNaN(Number(budgetFixed)) || Number(budgetFixed) <= 0) {
        newErrors.budgetFixed = 'Бюджет должен быть положительным числом';
      }
    } else if (budgetType === 'range') {
      if (!budgetMin.trim()) newErrors.budgetMin = 'Укажите минимальный бюджет';
      if (!budgetMax.trim()) newErrors.budgetMax = 'Укажите максимальный бюджет';
      
      if (Number(budgetMin) <= 0) newErrors.budgetMin = 'Бюджет должен быть положительным числом';
      if (Number(budgetMax) <= 0) newErrors.budgetMax = 'Бюджет должен быть положительным числом';
      
      if (Number(budgetMin) >= Number(budgetMax)) {
        newErrors.budgetMax = 'Максимальный бюджет должен быть больше минимального';
      }
    } else if (budgetType === 'hourly') {
      if (!budgetHourly.trim()) newErrors.budgetHourly = 'Укажите почасовую ставку';
      else if (isNaN(Number(budgetHourly)) || Number(budgetHourly) <= 0) {
        newErrors.budgetHourly = 'Ставка должна быть положительным числом';
      }
    }
    
    if (!duration.trim()) newErrors.duration = 'Укажите срок выполнения';
    else if (isNaN(Number(duration)) || Number(duration) <= 0) {
      newErrors.duration = 'Срок должен быть положительным числом';
    }
    
    if (!deadline.trim()) newErrors.deadline = 'Укажите дедлайн';
    else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        newErrors.deadline = 'Дедлайн должен быть в будущем';
      }
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
    const jobData = {
      title,
      description,
      category,
      skills,
      budget: {
        ...(budgetType === 'fixed' ? { fixed: Number(budgetFixed) } : {}),
        ...(budgetType === 'range' ? { min: Number(budgetMin), max: Number(budgetMax) } : {}),
        ...(budgetType === 'hourly' ? { hourlyRate: Number(budgetHourly) } : {}),
        currency
      },
      estimatedDuration: {
        value: Number(duration),
        unit: durationUnit
      },
      deadline: new Date(deadline)
    };
    
    // В реальном приложении здесь будет API запрос
    console.log('Отправка данных:', jobData);
    console.log('Файлы:', files);
    
    // Имитация отправки
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };
  
  // Если заказ успешно создан
  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-dark-800 border border-dark-700 rounded-xl p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Заказ успешно создан!</h1>
            <p className="text-gray-300 mb-8">
              Ваш заказ был успешно опубликован и теперь доступен для фрилансеров. Вы получите уведомление, когда появятся новые предложения.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/freelance-jobs" className="btn btn-primary">
                Вернуться к списку заказов
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
              to="/freelance-jobs" 
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к заказам</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-white">Создание нового заказа</h1>
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
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-white mb-2">Название заказа*</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Разработка мобильного приложения для фитнеса"
                    className={`w-full bg-dark-700 border ${errors.title ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-white mb-2">Описание заказа*</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Подробно опишите, что требуется сделать..."
                    rows={8}
                    className={`w-full bg-dark-700 border ${errors.description ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  <p className="text-gray-400 text-sm mt-1">
                    Вы можете использовать HTML-теги для форматирования текста.
                  </p>
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-white mb-2">Категория*</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full bg-dark-700 border ${errors.category ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
                
                {/* Skills */}
                <div>
                  <label className="block text-white mb-2">Требуемые навыки*</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <div 
                        key={skill} 
                        className="flex items-center bg-dark-600 text-white px-3 py-1 rounded-full"
                      >
                        <span>{skill}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Введите навык"
                      className={`flex-1 bg-dark-700 border ${errors.skills ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 rounded-r-lg flex items-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>
              </div>
            </div>
            
            {/* Budget and Timeline */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Бюджет и сроки</h2>
              
              <div className="space-y-6">
                {/* Budget Type */}
                <div>
                  <label className="block text-white mb-2">Тип бюджета*</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="budgetType"
                        checked={budgetType === 'fixed'}
                        onChange={() => setBudgetType('fixed')}
                        className="mr-2"
                      />
                      <span className="text-white">Фиксированный</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="budgetType"
                        checked={budgetType === 'range'}
                        onChange={() => setBudgetType('range')}
                        className="mr-2"
                      />
                      <span className="text-white">Диапазон</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="budgetType"
                        checked={budgetType === 'hourly'}
                        onChange={() => setBudgetType('hourly')}
                        className="mr-2"
                      />
                      <span className="text-white">Почасовая оплата</span>
                    </label>
                  </div>
                </div>
                
                {/* Budget Fields */}
                <div>
                  {budgetType === 'fixed' && (
                    <div>
                      <label htmlFor="budgetFixed" className="block text-white mb-2">Фиксированный бюджет*</label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="budgetFixed"
                            type="number"
                            value={budgetFixed}
                            onChange={(e) => setBudgetFixed(e.target.value)}
                            placeholder="Введите сумму"
                            className={`w-full bg-dark-700 border ${errors.budgetFixed ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
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
                      {errors.budgetFixed && <p className="text-red-500 text-sm mt-1">{errors.budgetFixed}</p>}
                    </div>
                  )}
                  
                  {budgetType === 'range' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budgetMin" className="block text-white mb-2">Минимальный бюджет*</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="budgetMin"
                            type="number"
                            value={budgetMin}
                            onChange={(e) => setBudgetMin(e.target.value)}
                            placeholder="Мин. сумма"
                            className={`w-full bg-dark-700 border ${errors.budgetMin ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          />
                        </div>
                        {errors.budgetMin && <p className="text-red-500 text-sm mt-1">{errors.budgetMin}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="budgetMax" className="block text-white mb-2">Максимальный бюджет*</label>
                        <div className="flex">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              id="budgetMax"
                              type="number"
                              value={budgetMax}
                              onChange={(e) => setBudgetMax(e.target.value)}
                              placeholder="Макс. сумма"
                              className={`w-full bg-dark-700 border ${errors.budgetMax ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
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
                        {errors.budgetMax && <p className="text-red-500 text-sm mt-1">{errors.budgetMax}</p>}
                      </div>
                    </div>
                  )}
                  
                  {budgetType === 'hourly' && (
                    <div>
                      <label htmlFor="budgetHourly" className="block text-white mb-2">Почасовая ставка*</label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            id="budgetHourly"
                            type="number"
                            value={budgetHourly}
                            onChange={(e) => setBudgetHourly(e.target.value)}
                            placeholder="Введите ставку в час"
                            className={`w-full bg-dark-700 border ${errors.budgetHourly ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
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
                      {errors.budgetHourly && <p className="text-red-500 text-sm mt-1">{errors.budgetHourly}</p>}
                    </div>
                  )}
                </div>
                
                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-white mb-2">Срок выполнения*</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Срок"
                        className={`w-full bg-dark-700 border ${errors.duration ? 'border-red-500' : 'border-dark-600'} rounded-l-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      />
                    </div>
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value as 'days' | 'weeks' | 'months')}
                      className="bg-dark-700 border border-dark-600 rounded-r-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="days">дней</option>
                      <option value="weeks">недель</option>
                      <option value="months">месяцев</option>
                    </select>
                  </div>
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>
                
                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="block text-white mb-2">Дедлайн*</label>
                  <input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`w-full bg-dark-700 border ${errors.deadline ? 'border-red-500' : 'border-dark-600'} rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>
              </div>
            </div>
            
            {/* Attachments */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Вложения</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-white mb-2">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-gray-400 text-sm mb-4">Поддерживаются файлы PDF, DOC, DOCX, JPG, PNG, ZIP (до 10 МБ)</p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn btn-secondary cursor-pointer"
                  >
                    Выбрать файлы
                  </label>
                </div>
                
                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h3 className="text-white font-medium">Загруженные файлы:</h3>
                    {files.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
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
              </div>
            </div>
            
            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link 
                to="/freelance-jobs" 
                className="btn btn-secondary"
              >
                Отмена
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Создание...' : 'Создать заказ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFreelanceJob;
