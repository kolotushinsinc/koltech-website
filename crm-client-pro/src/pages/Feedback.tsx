import { useState, useMemo, useEffect } from 'react';
import { 
  MessageSquare, Mail, User, Clock, CheckCircle, Reply, X, 
  Search, Filter, ArrowUp, ArrowDown, Send, Trash2, Edit,
  Home, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockFeedback, type FeedbackMessage } from '../data/mockData';
import { Modal } from '../components/Modal';

export function Feedback() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<FeedbackMessage[]>(mockFeedback);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort messages
  const filteredMessages = useMemo(() => {
    // First apply status filter
    let result = messages;
    if (filter !== 'all') {
      result = result.filter(msg => msg.status === filter);
    }
    
    // Then apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(msg => 
        msg.name.toLowerCase().includes(term) || 
        msg.email.toLowerCase().includes(term) || 
        msg.message.toLowerCase().includes(term)
      );
    }
    
    // Finally sort
    return result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
  }, [messages, filter, searchTerm, sortBy, sortDirection]);

  // Handle message status change
  const handleStatusChange = (messageId: string, newStatus: 'new' | 'read' | 'replied') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      )
    );
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: 'date' | 'name') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4" />;
      case 'read':
        return <CheckCircle className="w-4 h-4" />;
      case 'replied':
        return <Reply className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'read':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новое';
      case 'read':
        return 'Прочитано';
      case 'replied':
        return 'Отвечено';
      default:
        return status;
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
            <span className="text-white">Обратная связь</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Обратная связь</h1>
          <p className="text-dark-300">Просмотр сообщений от пользователей</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="badge bg-orange-500/20 text-orange-400 border-orange-500/30">
            {messages.filter(m => m.status === 'new').length} новых
          </span>
          <span className="badge bg-primary-500/20 text-primary-400 border-primary-500/30">
            {messages.filter(m => m.status === 'read').length} прочитано
          </span>
          <span className="badge bg-green-500/20 text-green-400 border-green-500/30">
            {messages.filter(m => m.status === 'replied').length} отвечено
          </span>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-dark-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск сообщений..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="form-select"
          >
            <option value="all">Все сообщения</option>
            <option value="new">Новые</option>
            <option value="read">Прочитанные</option>
            <option value="replied">Отвеченные</option>
          </select>
          
          <button 
            onClick={() => handleSort('date')}
            className="btn btn-secondary flex items-center"
            title="Сортировать по дате"
          >
            <Clock className="w-5 h-5 mr-2" />
            {sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages list */}
      {filteredMessages.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-16 h-16 text-dark-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Нет сообщений</h3>
          <p className="text-dark-300 mb-6">
            {filter === 'all' && !searchTerm
              ? 'Сообщения от пользователей появятся здесь'
              : 'Нет сообщений, соответствующих выбранным фильтрам'}
          </p>
          {(filter !== 'all' || searchTerm) && (
            <button 
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="btn btn-secondary"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMessages.map((message, index) => (
            <div
              key={message.id}
              onClick={() => {
                if (message.status === 'new') {
                  handleStatusChange(message.id, 'read');
                }
                navigate(`/feedback/${message.id}`);
              }}
              className={`card p-6 cursor-pointer group ${isLoading ? 'opacity-0' : 'animate-scale'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar avatar-md">
                    <span>{message.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{message.name}</h3>
                    <div className="flex items-center text-dark-300 text-sm">
                      <Mail className="w-3 h-3 mr-1" />
                      {message.email}
                    </div>
                  </div>
                </div>
                <span
                  className={`badge flex items-center gap-1 ${getStatusColor(message.status)}`}
                >
                  {getStatusIcon(message.status)}
                  {getStatusLabel(message.status)}
                </span>
              </div>

              <p className="text-dark-300 text-sm line-clamp-3 mb-4">{message.message}</p>

              <div className="flex items-center justify-between text-dark-400 text-xs pt-3 border-t border-dark-700">
                <span>
                  {new Date(message.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(message.id, 'read');
                    }}
                    className="p-1 rounded-lg hover:bg-dark-700"
                    title="Отметить как прочитанное"
                  >
                    <CheckCircle className="w-4 h-4 text-primary-400" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(message.id);
                    }}
                    className="p-1 rounded-lg hover:bg-dark-700"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}


function getStatusColor(status: string) {
  switch (status) {
    case 'new':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'read':
      return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
    case 'replied':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
  }
}
