import { useState, useEffect } from 'react';
import { FolderKanban, MessageSquare, CheckCircle, Clock, TrendingUp, Users, Briefcase, Calendar, Home } from 'lucide-react';
import { mockProjects, mockFeedback, mockClients, mockProProjects } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  // Calculate statistics
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter((p) => p.status === 'active').length;
  const completedProjects = mockProjects.filter((p) => p.status === 'completed').length;
  const totalFeedback = mockFeedback.length;
  const newFeedback = mockFeedback.filter((f) => f.status === 'new').length;
  const totalClients = mockClients.length;
  const totalBudget = mockProProjects.reduce((sum, project) => sum + project.budget, 0);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setAnimateStats(true), 300);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    {
      title: 'Всего проектов',
      value: totalProjects,
      icon: FolderKanban,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400',
    },
    {
      title: 'Активные проекты',
      value: activeProjects,
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
    },
    {
      title: 'Завершенные проекты',
      value: completedProjects,
      icon: CheckCircle,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400',
    },
    {
      title: 'Новых сообщений',
      value: newFeedback,
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400',
    },
  ];

  const additionalStats = [
    {
      title: 'Заказчики',
      value: totalClients,
      icon: Users,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
    },
    {
      title: 'Общий бюджет',
      value: `${(totalBudget / 1000000).toFixed(1)}M ₽`,
      icon: TrendingUp,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-500/10',
      textColor: 'text-secondary-400',
    },
  ];

  // Get current date
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="text-white">Дашборд</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Дашборд</h1>
          <p className="text-dark-300">Обзор вашей CRM-системы</p>
        </div>
        <div className="flex items-center space-x-2 text-dark-300 bg-dark-800/50 px-4 py-2 rounded-xl border border-dark-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{currentDate}</span>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`stat-card ${isLoading ? 'opacity-0' : 'animate-scale'}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className={`${card.bgColor} stat-icon`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            <p className="stat-label">{card.title}</p>
            <p className={`stat-value ${animateStats ? 'animate-pulse-slow' : ''}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects stats */}
        <div className={`card p-6 ${isLoading ? 'opacity-0' : 'animate-slide-up'}`} style={{ animationDelay: '200ms' }}>
          <h2 className="card-title mb-6">Статистика проектов</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Всего</span>
              <span className="text-white font-semibold">{totalProjects}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Активные</span>
              <span className="text-green-400 font-semibold">{activeProjects}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: `${(activeProjects / totalProjects) * 100}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Завершенные</span>
              <span className="text-violet-400 font-semibold">{completedProjects}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${(completedProjects / totalProjects) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Feedback stats */}
        <div className={`card p-6 ${isLoading ? 'opacity-0' : 'animate-slide-up'}`} style={{ animationDelay: '300ms' }}>
          <h2 className="card-title mb-6">Обратная связь</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Всего сообщений</span>
              <span className="text-white font-semibold">{totalFeedback}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: '100%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Новые</span>
              <span className="text-orange-400 font-semibold">{newFeedback}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${(newFeedback / totalFeedback) * 100}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Обработанные</span>
              <span className="text-primary-400 font-semibold">{totalFeedback - newFeedback}</span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" style={{ width: `${((totalFeedback - newFeedback) / totalFeedback) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Additional stats */}
        <div className={`card p-6 ${isLoading ? 'opacity-0' : 'animate-slide-up'}`} style={{ animationDelay: '400ms' }}>
          <h2 className="card-title mb-6">Дополнительно</h2>
          <div className="grid grid-cols-1 gap-4">
            {additionalStats.map((stat, index) => (
              <div key={index} className="bg-dark-700/50 rounded-xl p-4 flex items-center space-x-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-dark-300 text-sm">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
            
            <div className="bg-dark-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-300 text-sm">Выполнение плана</span>
                <span className="text-white font-semibold">75%</span>
              </div>
              <div className="w-full bg-dark-600 h-3 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
