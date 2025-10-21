import { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Mail, Phone, X, Building, Search, Filter, 
  Edit, Trash2, MoreVertical, Calendar, ArrowUpDown, Download,
  MessageCircle, FileText, User, Users, Star, StarOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockClients, mockProProjects, type Client } from '../../data/mockData';
import { Modal } from '../../components/Modal';

export function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [favoriteClients, setFavoriteClients] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter clients
  const filteredClients = clients.filter(client => {
    // Apply search filter
    if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !client.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !client.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && client.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  // Toggle favorite status
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteClients(prev => 
      prev.includes(id) 
        ? prev.filter(clientId => clientId !== id)
        : [...prev, id]
    );
  };

  // Handle client deletion
  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
  };

  // Get client projects
  const getClientProjects = (clientId: string) => {
    return mockProProjects.filter(project => project.client_id === clientId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Заказчики</h1>
          <p className="text-dark-300">Управление клиентской базой</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить заказчика
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-dark-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск заказчиков..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={statusFilter || ''} 
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="form-select"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
          
          <div className="flex rounded-xl overflow-hidden border border-dark-700">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'}`}
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-current rounded-sm"></div>
                <div className="w-2 h-2 bg-current rounded-sm"></div>
                <div className="w-2 h-2 bg-current rounded-sm"></div>
                <div className="w-2 h-2 bg-current rounded-sm"></div>
              </div>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 ${viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300'}`}
            >
              <div className="flex flex-col gap-1">
                <div className="w-6 h-1 bg-current rounded-sm"></div>
                <div className="w-6 h-1 bg-current rounded-sm"></div>
                <div className="w-6 h-1 bg-current rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Clients display */}
      {filteredClients.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => {
              const clientProjects = getClientProjects(client.id);
              const isFavorite = favoriteClients.includes(client.id);
              
              return (
                <div
                  key={client.id}
                  onClick={() => navigate(`/pro-clients/${client.id}`)}
                  className={`card p-6 cursor-pointer group ${isLoading ? 'opacity-0' : 'animate-scale'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="avatar avatar-lg">
                      <span className="text-xl">{client.name[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${
                        client.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>
                        {client.status === 'active' ? 'Активен' : 'Неактивен'}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(client.id);
                          }}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-dark-700 transition-opacity"
                        >
                          <MoreVertical className="w-5 h-5 text-dark-300" />
                        </button>
                        
                        {showDeleteConfirm === client.id && (
                          <div className="dropdown-menu animate-fade-in">
                            <button className="dropdown-item">
                              <Edit className="w-4 h-4 mr-2" />
                              <span>Редактировать</span>
                            </button>
                            <button className="dropdown-item">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              <span>Написать</span>
                            </button>
                            <button 
                              className="dropdown-item text-red-400 hover:bg-red-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span>Удалить</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="card-title">{client.name}</h3>
                    <button 
                      onClick={(e) => toggleFavorite(client.id, e)}
                      className="text-dark-300 hover:text-yellow-400 transition-colors"
                    >
                      {isFavorite ? (
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-primary-400 text-sm mb-4">{client.company}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-dark-300 text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-dark-300 text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-dark-400 pt-3 border-t border-dark-700">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(client.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{clientProjects.length} проектов</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="table-container">
              <table className="table w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Заказчик</th>
                    <th className="table-header-cell">Компания</th>
                    <th className="table-header-cell">Контакты</th>
                    <th className="table-header-cell">Статус</th>
                    <th className="table-header-cell">Проекты</th>
                    <th className="table-header-cell">Действия</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredClients.map((client, index) => {
                    const clientProjects = getClientProjects(client.id);
                    const isFavorite = favoriteClients.includes(client.id);
                    
                    return (
                      <tr 
                        key={client.id} 
                        className={`table-row ${isLoading ? 'opacity-0' : 'animate-fade-in'}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="avatar avatar-sm">
                              <span>{client.name[0]}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{client.name}</span>
                              {isFavorite && (
                                <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">{client.company}</td>
                        <td className="table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <Mail className="w-3 h-3 mr-1 text-dark-400" />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className="w-3 h-3 mr-1 text-dark-400" />
                              <span>{client.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${
                            client.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }`}>
                            {client.status === 'active' ? 'Активен' : 'Неактивен'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">
                            {clientProjects.length}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/pro-clients/${client.id}`);
                              }}
                              className="p-1 rounded-lg hover:bg-dark-700"
                            >
                              <User className="w-4 h-4 text-primary-400" />
                            </button>
                            <button 
                              onClick={(e) => toggleFavorite(client.id, e)}
                              className="p-1 rounded-lg hover:bg-dark-700"
                            >
                              {isFavorite ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="w-4 h-4 text-dark-400" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-1 rounded-lg hover:bg-dark-700"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <Users className="w-16 h-16 text-dark-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Заказчики не найдены</h3>
          <p className="text-dark-300 mb-6">
            {searchTerm || statusFilter 
              ? 'Попробуйте изменить параметры поиска или фильтры'
              : 'Добавьте своего первого заказчика, нажав кнопку "Добавить заказчика"'}
          </p>
          {(searchTerm || statusFilter) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter(null);
              }}
              className="btn btn-secondary"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Create client modal */}
      {showCreateModal && <CreateClientModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

function CreateClientModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Новый заказчик">
      <form className="space-y-4">
          <div className="form-group">
            <label className="form-label">Полное имя</label>
            <input
              type="text"
              className="form-input"
              placeholder="Иван Петров"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Компания</label>
            <input
              type="text"
              className="form-input"
              placeholder="ООО «Технологии»"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="client@company.ru"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Телефон</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+7 (495) 123-45-67"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Статус</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="status" value="active" className="text-primary-500 focus:ring-primary-500" defaultChecked />
                <span className="text-white">Активен</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="status" value="inactive" className="text-primary-500 focus:ring-primary-500" />
                <span className="text-white">Неактивен</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
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
              Создать заказчика
            </button>
          </div>
        </form>
    </Modal>
  );
}
