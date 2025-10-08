import { useState, useEffect } from 'react';
import { FolderKanban, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

interface Project {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'on_hold';
}

interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Загрузка проектов
        const projectsResponse = await axios.get('http://localhost:5006/api/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Загрузка сообщений обратной связи
        const feedbackResponse = await axios.get('http://localhost:5006/api/contacts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (projectsResponse.data.success) {
          setProjects(projectsResponse.data.projects);
        }
        
        if (feedbackResponse.data.success) {
          setFeedback(feedbackResponse.data.messages);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setProjects([]);
        setFeedback([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: Project) => p.status === 'active').length;
  const completedProjects = projects.filter((p: Project) => p.status === 'completed').length;
  const totalFeedback = feedback.length;
  const newFeedback = feedback.filter((f: FeedbackMessage) => f.status === 'new').length;

  const statCards = [
    {
      title: 'Всего проектов',
      value: totalProjects,
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Активные проекты',
      value: activeProjects,
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Завершенные проекты',
      value: completedProjects,
      icon: CheckCircle,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      title: 'Новых сообщений',
      value: newFeedback,
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-slate-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Дашборд</h1>
        <p className="text-slate-400">Обзор вашей KolTech CRM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">{card.title}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Статистика</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-slate-300 font-semibold mb-3">Проекты</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Всего</span>
                <span className="text-white font-semibold">{totalProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Активные</span>
                <span className="text-green-400 font-semibold">{activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Завершенные</span>
                <span className="text-violet-400 font-semibold">{completedProjects}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-300 font-semibold mb-3">Обратная связь</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Всего сообщений</span>
                <span className="text-white font-semibold">{totalFeedback}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Новые</span>
                <span className="text-orange-400 font-semibold">{newFeedback}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Обработанные</span>
                <span className="text-blue-400 font-semibold">
                  {totalFeedback - newFeedback}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
