import { useState, useEffect } from 'react';
import { 
  FolderKanban, Plus, X, DollarSign, Calendar, User, Briefcase, 
  Eye, ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { mockProProjects, mockClients, mockEmployees, type ProProject } from '../../data/mockData';
import { Modal } from '../../components/Modal';

// Main projects list component
export function ProProjects() {
  const [projects] = useState<ProProject[]>(mockProProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  
  const getClient = (id: string) => mockClients.find(c => c.id === id);
  const getEmployee = (id: string) => mockEmployees.find(e => e.id === id);
  
  // Navigate to project detail page
  const openProjectDetail = (project: ProProject) => {
    navigate(`/pro-projects/${project.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'on_hold': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Планирование';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'on_hold': return 'На паузе';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Главная</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">Проекты</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Проекты</h1>
          <p className="text-dark-300">Управление проектами для заказчиков</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Создать проект
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => {
          const client = getClient(project.client_id);
          const employee = getEmployee(project.employee_id);

          return (
            <div
              key={project.id}
              className="card p-6 hover:transform hover:scale-[1.02] transition-all duration-300 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={() => openProjectDetail(project)}
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Просмотреть
                </button>
              </div>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <span className={`badge ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>

              <p className="text-dark-300 mb-4">{project.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
                  <div className="flex items-center text-dark-400 text-xs mb-1">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Заказчик
                  </div>
                  <p className="text-white text-sm font-semibold">{client?.name}</p>
                </div>

                <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
                  <div className="flex items-center text-dark-400 text-xs mb-1">
                    <User className="w-3 h-3 mr-1" />
                    Сотрудник
                  </div>
                  <p className="text-white text-sm font-semibold">{employee?.name}</p>
                </div>

                <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
                  <div className="flex items-center text-dark-400 text-xs mb-1">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Бюджет
                  </div>
                  <p className="text-white text-sm font-semibold">{project.budget.toLocaleString('ru-RU')} ₽</p>
                </div>

                <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
                  <div className="flex items-center text-dark-400 text-xs mb-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Дедлайн
                  </div>
                  <p className="text-white text-sm font-semibold">
                    {new Date(project.deadline).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create project modal */}
      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Новый проект" maxWidth="2xl">
      <form className="space-y-4">
          <div className="form-group">
            <label className="form-label">Название проекта</label>
            <input
              type="text"
              className="form-input"
              placeholder="Разработка веб-приложения"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Подробное описание проекта..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Заказчик</label>
              <select className="form-select">
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ответственный сотрудник</label>
              <select className="form-select">
                {mockEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Бюджет (₽)</label>
              <input
                type="number"
                className="form-input"
                placeholder="1000000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Дедлайн</label>
              <input
                type="date"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Статус</label>
            <select className="form-select">
              <option value="planning">Планирование</option>
              <option value="in_progress">В работе</option>
              <option value="on_hold">На паузе</option>
              <option value="completed">Завершен</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Создать проект
            </button>
          </div>
        </form>
    </Modal>
  );
}
