import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  Briefcase, 
  User, 
  Calendar, 
  Send, 
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Временная заглушка для данных
const MOCK_JOB = {
  id: '1',
  title: 'Разработка мобильного приложения для фитнеса',
  description: `
    <p>Требуется разработать мобильное приложение для отслеживания тренировок и питания с интеграцией с фитнес-трекерами.</p>
    
    <h3>Основные требования:</h3>
    <ul>
      <li>Разработка нативного приложения для iOS и Android</li>
      <li>Интеграция с Apple Health и Google Fit</li>
      <li>Отслеживание тренировок, питания и прогресса</li>
      <li>Создание персонализированных планов тренировок</li>
      <li>Социальные функции для взаимодействия между пользователями</li>
    </ul>
    
    <h3>Технические требования:</h3>
    <ul>
      <li>Использование React Native и TypeScript</li>
      <li>Хранение данных в Firebase</li>
      <li>Аутентификация через Firebase Auth</li>
      <li>Чистый и современный UI/UX дизайн</li>
    </ul>
    
    <p>Проект должен быть выполнен в течение 3 месяцев с момента начала работы. Предпочтение отдается кандидатам с опытом разработки фитнес-приложений.</p>
  `,
  category: 'Mobile Development',
  skills: ['React Native', 'TypeScript', 'Firebase', 'UI/UX', 'iOS', 'Android'],
  budget: {
    min: 1500,
    max: 3000,
    currency: 'USD'
  },
  deadline: new Date('2026-01-15'),
  estimatedDuration: {
    value: 3,
    unit: 'months'
  },
  clientId: 'client1',
  clientName: 'TechFit Inc.',
  clientAvatar: '',
  clientJoined: new Date('2024-05-10'),
  clientProjects: 5,
  clientRating: 4.8,
  status: 'open',
  proposals: 7,
  createdAt: new Date('2025-10-15'),
  attachments: [
    {
      filename: 'project_requirements.pdf',
      originalName: 'TechFit_App_Requirements.pdf',
      mimeType: 'application/pdf',
      size: 2500000,
      url: '#'
    },
    {
      filename: 'design_mockups.zip',
      originalName: 'App_Design_Mockups.zip',
      mimeType: 'application/zip',
      size: 15000000,
      url: '#'
    }
  ]
};

const FreelanceJobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [job, setJob] = useState(MOCK_JOB);
  const [loading, setLoading] = useState(true);
  const [proposalText, setProposalText] = useState('');
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');
  const [proposalDurationUnit, setProposalDurationUnit] = useState('days');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setJob(MOCK_JOB);
      setLoading(false);
    }, 500);
  }, [jobId]);
  
  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Отправка предложения
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!proposalText || !proposalPrice || !proposalDuration) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    setSubmitting(true);
    
    // В реальном приложении здесь будет API запрос
    setTimeout(() => {
      setSubmitting(false);
      setHasSubmitted(true);
      // Очистка формы
      setProposalText('');
      setProposalPrice('');
      setProposalDuration('');
    }, 1000);
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
              to="/freelance-jobs" 
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к заказам</span>
            </Link>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-gray-400">{job.category}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">Опубликовано {formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Description */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Описание проекта</h2>
              <div 
                className="text-gray-300 space-y-4 job-description"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              
              {/* Skills */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Требуемые навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Attachments */}
              {job.attachments && job.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Вложения</h3>
                  <div className="space-y-3">
                    {job.attachments.map((file, index) => (
                      <a 
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-primary-400 mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{file.originalName}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                        <span className="text-primary-400 text-sm">Скачать</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Proposal */}
            {!hasSubmitted ? (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Отправить предложение</h2>
                
                {!isAuthenticated ? (
                  <div className="bg-dark-700 rounded-lg p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-white mb-4">Для отправки предложения необходимо авторизоваться</p>
                    <Link 
                      to="/auth" 
                      className="btn btn-primary"
                    >
                      Войти или зарегистрироваться
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProposal}>
                    <div className="mb-4">
                      <label className="block text-white mb-2">Сопроводительное письмо</label>
                      <textarea
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        placeholder="Опишите, почему вы подходите для этого проекта..."
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-white mb-2">Ваша цена ({job.budget.currency})</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            value={proposalPrice}
                            onChange={(e) => setProposalPrice(e.target.value)}
                            placeholder="Введите сумму"
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Бюджет заказчика: {job.budget.min} - {job.budget.max} {job.budget.currency}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-white mb-2">Срок выполнения</label>
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="number"
                              value={proposalDuration}
                              onChange={(e) => setProposalDuration(e.target.value)}
                              placeholder="Срок"
                              className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              required
                            />
                          </div>
                          
                          <select
                            value={proposalDurationUnit}
                            onChange={(e) => setProposalDurationUnit(e.target.value)}
                            className="bg-dark-700 border border-dark-600 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="days">дней</option>
                            <option value="weeks">недель</option>
                            <option value="months">месяцев</option>
                          </select>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Ожидаемый срок: {job.estimatedDuration.value} {
                            job.estimatedDuration.unit === 'days' ? 'дней' :
                            job.estimatedDuration.unit === 'weeks' ? 'недель' :
                            'месяцев'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full flex items-center justify-center space-x-2 btn ${
                        submitting ? 'btn-disabled' : 'btn-primary'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Отправка...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Отправить предложение</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">Предложение отправлено</h2>
                  <p className="text-gray-400 mb-6">
                    Ваше предложение успешно отправлено заказчику. Вы получите уведомление, когда заказчик рассмотрит его.
                  </p>
                  <Link 
                    to="/freelance-jobs" 
                    className="btn btn-primary"
                  >
                    Вернуться к списку заказов
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Job Details */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Детали заказа</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-primary-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Бюджет</h3>
                    <p className="text-gray-300">
                      {job.budget.min} - {job.budget.max} {job.budget.currency}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Срок выполнения</h3>
                    <p className="text-gray-300">
                      {job.estimatedDuration.value} {
                        job.estimatedDuration.unit === 'days' ? 'дней' :
                        job.estimatedDuration.unit === 'weeks' ? 'недель' :
                        'месяцев'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Дедлайн</h3>
                    <p className="text-gray-300">{formatDate(job.deadline)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-primary-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">Предложения</h3>
                    <p className="text-gray-300">{job.proposals} предложений</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Info */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">О заказчике</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{job.clientName}</h3>
                  <p className="text-gray-400 text-sm">На платформе с {formatDate(job.clientJoined)}</p>
                </div>
              </div>
              
              <div className="space-y-3 border-t border-dark-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Рейтинг</span>
                  <span className="text-white">{job.clientRating}/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Проектов</span>
                  <span className="text-white">{job.clientProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Местоположение</span>
                  <span className="text-white">Россия</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceJobDetail;
