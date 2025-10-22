import { useState } from 'react';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  BarChart3,
  Eye,
  MessageSquare,
  Download,
  FileText,
  Send,
  X,
  Upload,
  Star
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  type: string;
  status: string;
  progress: number;
  startDate: string;
  deadline: string;
  budget: string;
  manager: string;
  statusColor: string;
  lastUpdate: string;
  description: string;
  tasks: Array<{
    name: string;
    status: string;
    progress: number;
  }>;
  files: Array<{
    name: string;
    size: string;
    date: string;
  }>;
  messages: Array<{
    sender: string;
    message: string;
    time: string;
    date: string;
  }>;
}

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState('details');
  const [newMessage, setNewMessage] = useState('');

  const projects: Project[] = [
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
    }
  ];

  const stats = [
    { 
      label: 'Активные проекты', 
      value: '2', 
      icon: FolderKanban, 
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Завершенные проекты', 
      value: '8', 
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Общий бюджет', 
      value: '$125K', 
      icon: DollarSign, 
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      label: 'Средний рейтинг', 
      value: '4.9', 
      icon: BarChart3, 
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'В работе':
        return <Clock className="w-4 h-4" />;
      case 'Тестирование':
        return <BarChart3 className="w-4 h-4" />;
      case 'Завершен':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать!</h1>
        <p className="text-dark-300">Управляйте своими проектами и отслеживайте прогресс</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card p-6"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
            <p className="text-dark-300 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Мои проекты</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="card p-6 cursor-pointer"
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <span className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-dark-400">
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
                  <p className="text-dark-400 text-xs mb-1">Прогресс</p>
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
                  <p className="text-dark-400 text-xs mb-1">Бюджет</p>
                  <p className="text-white font-medium">{project.budget}</p>
                </div>
                <div>
                  <p className="text-dark-400 text-xs mb-1">Начало</p>
                  <p className="text-white font-medium">{project.startDate}</p>
                </div>
                <div>
                  <p className="text-dark-400 text-xs mb-1">Дедлайн</p>
                  <p className="text-white font-medium">{project.deadline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && selectedProjectData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-dark-800 border border-dark-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedProjectData.name}</h2>
                <p className="text-dark-400">{selectedProjectData.type}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-dark-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-dark-400" />
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
                      : 'text-dark-400 hover:text-white'
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
                    <p className="text-dark-300 leading-relaxed">{selectedProjectData.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-2">Информация</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-dark-400">Менеджер:</span>
                          <span className="text-white">{selectedProjectData.manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-400">Бюджет:</span>
                          <span className="text-white">{selectedProjectData.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-400">Дедлайн:</span>
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
                            : 'bg-dark-700 text-dark-300'
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
                            <p className="text-dark-400 text-sm">{file.size} • {file.date}</p>
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
      )}
    </div>
  );
}
