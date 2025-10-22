import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, FolderOpen, Clock, CheckCircle, AlertCircle, MessageSquare, Calendar, DollarSign, Settings, Bell, Download, Eye, BarChart3, Zap, X, Send, FileText, Upload, Save, CreditCard as Edit, Camera, Mail, Phone, Lock, Palette, Globe, Shield, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState<string | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState('details');
  const [newMessage, setNewMessage] = useState('');
  const [settings, setSettings] = useState({
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    company: 'ООО "Инновации"',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: 'dark',
    language: 'ru'
  });

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      type: 'Веб-разработка',
      status: 'В работе',
      progress: 75,
      startDate: '2024-01-15',
      deadline: '2024-03-15',
      budget: '$15,000',
      manager: 'Алексей Иванов',
      statusColor: 'from-blue-500 to-cyan-500',
      lastUpdate: '2 дня назад',
      description: 'Разработка современной e-commerce платформы с интеграцией платежных систем и системой управления заказами.',
      tasks: [
        { name: 'Дизайн интерфейса', status: 'completed', progress: 100 },
        { name: 'Frontend разработка', status: 'in-progress', progress: 80 },
        { name: 'Backend API', status: 'in-progress', progress: 70 },
        { name: 'Интеграция платежей', status: 'pending', progress: 0 },
        { name: 'Тестирование', status: 'pending', progress: 0 }
      ],
      files: [
        { name: 'Техническое задание.pdf', size: '2.4 MB', date: '15.01.2024' },
        { name: 'Дизайн макеты.fig', size: '15.8 MB', date: '22.01.2024' },
        { name: 'API документация.pdf', size: '1.2 MB', date: '05.02.2024' }
      ],
      messages: [
        { sender: 'Алексей Иванов', message: 'Завершили работу над дизайном главной страницы', time: '10:30', date: '2024-02-10' },
        { sender: 'Вы', message: 'Отлично! Когда можно будет посмотреть демо?', time: '11:15', date: '2024-02-10' },
        { sender: 'Алексей Иванов', message: 'Демо будет готово к концу недели', time: '14:20', date: '2024-02-10' }
      ]
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      type: 'Мобильное приложение',
      status: 'Тестирование',
      progress: 90,
      startDate: '2023-11-01',
      deadline: '2024-02-01',
      budget: '$25,000',
      manager: 'Мария Петрова',
      statusColor: 'from-yellow-500 to-orange-500',
      lastUpdate: '1 день назад',
      description: 'Мобильное банковское приложение с функциями переводов, платежей и аналитики расходов.',
      tasks: [
        { name: 'iOS разработка', status: 'completed', progress: 100 },
        { name: 'Android разработка', status: 'completed', progress: 100 },
        { name: 'Backend интеграция', status: 'completed', progress: 100 },
        { name: 'Тестирование', status: 'in-progress', progress: 85 },
        { name: 'Публикация в сторы', status: 'pending', progress: 0 }
      ],
      files: [
        { name: 'iOS Build v1.2.apk', size: '45.2 MB', date: '08.02.2024' },
        { name: 'Android Build v1.2.ipa', size: '38.7 MB', date: '08.02.2024' },
        { name: 'Тест план.xlsx', size: '890 KB', date: '01.02.2024' }
      ],
      messages: [
        { sender: 'Мария Петрова', message: 'Приложение прошло все основные тесты', time: '09:45', date: '2024-02-11' },
        { sender: 'Вы', message: 'Когда планируется релиз?', time: '10:30', date: '2024-02-11' },
        { sender: 'Мария Петрова', message: 'Планируем подать на модерацию на следующей неделе', time: '11:00', date: '2024-02-11' }
      ]
    },
    {
      id: 3,
      name: 'AI Chatbot Integration',
      type: 'AI-решения',
      status: 'Завершен',
      progress: 100,
      startDate: '2023-10-01',
      deadline: '2023-12-15',
      budget: '$8,000',
      manager: 'Дмитрий Сидоров',
      statusColor: 'from-green-500 to-emerald-500',
      lastUpdate: '1 неделя назад',
      description: 'Интеграция AI чат-бота для автоматизации клиентской поддержки с обработкой естественного языка.',
      tasks: [
        { name: 'Анализ требований', status: 'completed', progress: 100 },
        { name: 'Обучение модели', status: 'completed', progress: 100 },
        { name: 'Интеграция с сайтом', status: 'completed', progress: 100 },
        { name: 'Тестирование', status: 'completed', progress: 100 },
        { name: 'Запуск', status: 'completed', progress: 100 }
      ],
      files: [
        { name: 'Финальный отчет.pdf', size: '3.1 MB', date: '15.12.2023' },
        { name: 'Инструкция по использованию.pdf', size: '1.8 MB', date: '15.12.2023' },
        { name: 'Исходный код.zip', size: '12.4 MB', date: '15.12.2023' }
      ],
      messages: [
        { sender: 'Дмитрий Сидоров', message: 'Проект успешно завершен и передан в эксплуатацию', time: '16:00', date: '2023-12-15' },
        { sender: 'Вы', message: 'Спасибо за отличную работу!', time: '16:30', date: '2023-12-15' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'В работе':
        return <Clock className="w-4 h-4" />;
      case 'Тестирование':
        return <AlertCircle className="w-4 h-4" />;
      case 'Завершен':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
    setActiveProjectTab('details');
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Здесь будет логика отправки сообщения
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const stats = [
    { 
      id: 'active',
      label: 'Активные проекты', 
      value: '2', 
      icon: FolderOpen, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Проекты в активной разработке'
    },
    { 
      id: 'completed',
      label: 'Завершенные проекты', 
      value: '8', 
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500',
      description: 'Успешно завершенные проекты'
    },
    { 
      id: 'budget',
      label: 'Общий бюджет', 
      value: '$125K', 
      icon: DollarSign, 
      color: 'from-purple-500 to-indigo-500',
      description: 'Общая стоимость всех проектов'
    },
    { 
      id: 'rating',
      label: 'Средний рейтинг', 
      value: '4.9', 
      icon: BarChart3, 
      color: 'from-yellow-500 to-orange-500',
      description: 'Средняя оценка качества работ'
    }
  ];

  // Additional data for stats modals
  const statsData = {
    active: {
      title: 'Активные проекты',
      projects: projects.filter(p => p.status === 'В работе' || p.status === 'Тестирование'),
      totalValue: '$40,000',
      avgProgress: 82
    },
    completed: {
      title: 'Завершенные проекты',
      projects: [
        ...projects.filter(p => p.status === 'Завершен'),
        { id: 4, name: 'Corporate Website', type: 'Веб-разработка', status: 'Завершен', progress: 100, budget: '$12,000', manager: 'Анна Козлова', statusColor: 'from-green-500 to-emerald-500', completedDate: '2023-12-01' },
        { id: 5, name: 'CRM System', type: 'Веб-приложение', status: 'Завершен', progress: 100, budget: '$35,000', manager: 'Петр Сидоров', statusColor: 'from-green-500 to-emerald-500', completedDate: '2023-11-15' },
        { id: 6, name: 'Mobile Game', type: 'Мобильное приложение', status: 'Завершен', progress: 100, budget: '$18,000', manager: 'Елена Волкова', statusColor: 'from-green-500 to-emerald-500', completedDate: '2023-10-20' },
        { id: 7, name: 'Analytics Dashboard', type: 'Веб-приложение', status: 'Завершен', progress: 100, budget: '$22,000', manager: 'Игорь Новиков', statusColor: 'from-green-500 to-emerald-500', completedDate: '2023-09-30' },
        { id: 8, name: 'E-learning Platform', type: 'Веб-разработка', status: 'Завершен', progress: 100, budget: '$28,000', manager: 'Ольга Морозова', statusColor: 'from-green-500 to-emerald-500', completedDate: '2023-08-15' }
      ],
      totalValue: '$123,000',
      avgRating: 4.8
    },
    budget: {
      title: 'Бюджет проектов',
      breakdown: [
        { category: 'Веб-разработка', amount: '$65,000', percentage: 52, color: 'from-blue-500 to-cyan-500' },
        { category: 'Мобильные приложения', amount: '$43,000', percentage: 34, color: 'from-purple-500 to-pink-500' },
        { category: 'AI-решения', amount: '$17,000', percentage: 14, color: 'from-green-500 to-emerald-500' }
      ],
      totalSpent: '$125,000',
      avgProjectCost: '$12,500'
    },
    rating: {
      title: 'Рейтинги проектов',
      ratings: [
        { project: 'AI Chatbot Integration', rating: 5.0, feedback: 'Превосходная работа, превзошли ожидания' },
        { project: 'Mobile Banking App', rating: 4.9, feedback: 'Отличное качество и своевременная доставка' },
        { project: 'E-commerce Platform', rating: 4.8, feedback: 'Профессиональный подход к решению задач' },
        { project: 'Corporate Website', rating: 4.9, feedback: 'Современный дизайн и быстрая загрузка' },
        { project: 'CRM System', rating: 4.7, feedback: 'Функциональная система с хорошей поддержкой' }
      ],
      avgRating: 4.86,
      totalReviews: 8
    }
  };

  const handleStatsClick = (statId: string) => {
    setShowStatsModal(statId);
  };

  // Settings Modal Component
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Настройки</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-dark-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Профиль
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleSettingsChange('name', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingsChange('email', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Телефон</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingsChange('phone', e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Уведомления
            </h3>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">
                    {key === 'email' ? 'Email уведомления' : 
                     key === 'push' ? 'Push уведомления' : 'SMS уведомления'}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingsChange('notifications', {
                      ...settings.notifications,
                      [key]: e.target.checked
                    })}
                    className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => setShowSettings(false)}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );

  // Project Details Modal Component
  const ProjectDetailsModal = () => {
    if (!selectedProjectData) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-dark-800 border border-dark-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedProjectData.name}</h2>
              <p className="text-gray-400">{selectedProjectData.type}</p>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-dark-700 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dark-700">
            {[
              { id: 'details', label: 'Детали', icon: Eye },
              { id: 'chat', label: 'Чат', icon: MessageSquare },
              { id: 'files', label: 'Файлы', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProjectTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeProjectTab === tab.id
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeProjectTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Описание проекта</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProjectData.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Информация</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Менеджер:</span>
                        <span className="text-white">{selectedProjectData.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Бюджет:</span>
                        <span className="text-white">{selectedProjectData.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Дедлайн:</span>
                        <span className="text-white">{selectedProjectData.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Прогресс: {selectedProjectData.progress}%</h4>
                    <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
                      <div 
                        className={`h-full bg-gradient-to-r ${selectedProjectData.statusColor} rounded-full transition-all duration-1000`}
                        style={{ width: `${selectedProjectData.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Задачи</h4>
                  <div className="space-y-3">
                    {selectedProjectData.tasks.map((task, index) => (
                      <div key={index} className="bg-dark-700 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{task.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {task.status === 'completed' ? 'Завершено' :
                             task.status === 'in-progress' ? 'В работе' : 'Ожидает'}
                          </span>
                        </div>
                        <div className="w-full bg-dark-600 rounded-full h-2">
                          <div 
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeProjectTab === 'chat' && (
              <div className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedProjectData.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'Вы' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === 'Вы' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-dark-700 text-gray-300'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3 pt-4 border-t border-dark-700">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Написать сообщение..."
                    className="flex-1 bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeProjectTab === 'files' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Файлы проекта</h3>
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Загрузить</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedProjectData.files.map((file, index) => (
                    <div key={index} className="bg-dark-700 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary-400" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <button className="text-primary-400 hover:text-primary-300 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Stats Modal Component
  const StatsModal = () => {
    if (!showStatsModal) return null;
    
    const data = statsData[showStatsModal as keyof typeof statsData];
    const stat = stats.find(s => s.id === showStatsModal);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-dark-800 border border-dark-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat?.color} rounded-2xl flex items-center justify-center`}>
                {stat?.icon && <stat.icon className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{data.title}</h2>
                <p className="text-gray-400">{stat?.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowStatsModal(null)}
              className="p-2 hover:bg-dark-700 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {showStatsModal === 'active' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.projects.length}</div>
                    <div className="text-gray-400">Активных проектов</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.totalValue}</div>
                    <div className="text-gray-400">Общая стоимость</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.avgProgress}%</div>
                    <div className="text-gray-400">Средний прогресс</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {data.projects.map((project: any, index: number) => (
                    <div key={project.id} className="ios-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{project.name}</h3>
                          <p className="text-gray-400">{project.type}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${project.statusColor} text-white text-sm`}>
                          {project.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Прогресс</span>
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-dark-700 rounded-full h-2">
                            <div 
                              className={`h-full bg-gradient-to-r ${project.statusColor} rounded-full transition-all duration-1000`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{project.budget}</div>
                          <div className="text-gray-400 text-sm">{project.manager}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showStatsModal === 'completed' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.projects.length}</div>
                    <div className="text-gray-400">Завершенных проектов</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.totalValue}</div>
                    <div className="text-gray-400">Общая стоимость</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.avgRating}★</div>
                    <div className="text-gray-400">Средний рейтинг</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {data.projects.map((project: any, index: number) => (
                    <div key={project.id} className="ios-card p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{project.name}</h3>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Тип:</span>
                          <span className="text-white">{project.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Бюджет:</span>
                          <span className="text-white">{project.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Завершен:</span>
                          <span className="text-white">{project.completedDate || 'Недавно'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Менеджер:</span>
                          <span className="text-white">{project.manager}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showStatsModal === 'budget' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.totalSpent}</div>
                    <div className="text-gray-400">Общие затраты</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.avgProjectCost}</div>
                    <div className="text-gray-400">Средняя стоимость проекта</div>
                  </div>
                </div>
                
                <div className="ios-card p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-6">Распределение бюджета по категориям</h3>
                  <div className="space-y-6">
                    {data.breakdown.map((item: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{item.category}</span>
                          <div className="text-right">
                            <div className="text-white font-bold">{item.amount}</div>
                            <div className="text-gray-400 text-sm">{item.percentage}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-dark-700 rounded-full h-3">
                          <div 
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showStatsModal === 'rating' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.avgRating}★</div>
                    <div className="text-gray-400">Средний рейтинг</div>
                  </div>
                  <div className="ios-card p-6 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-white mb-2">{data.totalReviews}</div>
                    <div className="text-gray-400">Всего отзывов</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {data.ratings.map((rating: any, index: number) => (
                    <div key={index} className="ios-card p-6 rounded-2xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{rating.project}</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">{rating.feedback}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-bold">{rating.rating}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= rating.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Dashboard Header */}
      <section className="pt-24 pb-8 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Добро пожаловать, Иван!</h1>
                <p className="text-gray-400">Управляйте своими проектами и отслеживайте прогресс</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="ios-card p-3 rounded-xl hover:bg-dark-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={() => setShowSettings(true)} className="ios-card p-3 rounded-xl hover:bg-dark-700 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="ios-card p-6 rounded-2xl magnetic-hover slide-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleStatsClick(stat.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 ios-card p-2 rounded-2xl w-fit">
            {[
              { id: 'projects', label: 'Проекты', icon: FolderOpen },
              { id: 'messages', label: 'Сообщения', icon: MessageSquare },
              { id: 'calendar', label: 'Календарь', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Мои проекты</h2>
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Новый проект
                </Link>
              </div>

              <div className="grid gap-6">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="ios-card p-6 rounded-2xl magnetic-hover slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{project.name}</h3>
                          <span className="text-xs bg-dark-700 text-gray-300 px-2 py-1 rounded-full">
                            {project.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Менеджер: {project.manager}</span>
                          <span>•</span>
                          <span>Обновлено: {project.lastUpdate}</span>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${project.statusColor} text-white text-sm`}>
                        {getStatusIcon(project.status)}
                        <span>{project.status}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Прогресс</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-dark-700 rounded-full h-2">
                            <div 
                              className={`h-full bg-gradient-to-r ${project.statusColor} rounded-full transition-all duration-1000`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-white text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Бюджет</p>
                        <p className="text-white font-medium">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Начало</p>
                        <p className="text-white font-medium">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Дедлайн</p>
                        <p className="text-white font-medium">{project.deadline}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                          <Eye className="w-4 h-4" onClick={() => handleProjectClick(project.id)} />
                          <span className="text-sm">Детали</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">Чат</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                          <Download className="w-4 h-4" onClick={() => handleProjectClick(project.id)} />
                          <span className="text-sm">Файлы</span>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{project.id.toString().padStart(4, '0')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="ios-card p-8 rounded-2xl text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Сообщения</h3>
              <p className="text-gray-400 mb-6">Здесь будут отображаться ваши сообщения с командой</p>
              <button className="ios-button">
                Открыть чат
              </button>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="ios-card p-8 rounded-2xl text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Календарь</h3>
              <p className="text-gray-400 mb-6">Отслеживайте важные даты и дедлайны проектов</p>
              <button className="ios-button">
                Открыть календарь
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {selectedProject && <ProjectDetailsModal />}
      {showStatsModal && <StatsModal />}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;