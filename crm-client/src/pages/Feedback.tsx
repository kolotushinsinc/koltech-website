import { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Mail, User, Clock, CheckCircle, Reply, X } from 'lucide-react';
import axios from 'axios';

// Функция для получения метки услуги
const getServiceLabel = (service: string): string => {
  switch (service) {
    case 'web_development':
      return 'Веб-разработка';
    case 'mobile_development':
      return 'Мобильная разработка';
    case 'ai_solutions':
      return 'AI-решения';
    case 'business_accelerator':
      return 'Бизнес-акселератор';
    case 'koltech_line':
      return 'KolTech Line';
    case 'consulting':
      return 'Консалтинг';
    default:
      return service;
  }
};

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

export function Feedback() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<FeedbackMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сообщений с сервера
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://api.koltech.dev/api/contacts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        // В случае ошибки используем пустой массив
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter(msg => msg.status === filter);
  }, [messages, filter]);

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
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'read':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'replied':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Обратная связь</h1>
        <p className="text-slate-400">Просмотр сообщений от пользователей</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {['all', 'new', 'read', 'replied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {status === 'all' && 'Все'}
            {status === 'new' && 'Новые'}
            {status === 'read' && 'Прочитанные'}
            {status === 'replied' && 'Отвеченные'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Загрузка сообщений</h3>
          <p className="text-slate-400">Пожалуйста, подождите...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Нет сообщений</h3>
          <p className="text-slate-400">
            {filter === 'all'
              ? 'Сообщения от пользователей появятся здесь'
              : `Нет сообщений со статусом "${getStatusLabel(filter)}"`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{message.name}</h3>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Mail className="w-3 h-3 mr-1" />
                      {message.email}
                    </div>
                    {message.company && (
                      <div className="text-slate-400 text-xs mt-1">
                        Компания: {message.company}
                      </div>
                    )}
                    {message.service && (
                      <div className="text-slate-400 text-xs">
                        Услуга: {getServiceLabel(message.service)}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                    message.status
                  )}`}
                >
                  {getStatusIcon(message.status)}
                  {getStatusLabel(message.status)}
                </span>
              </div>

              <p className="text-slate-300 text-sm line-clamp-3 mb-4">{message.message}</p>

              <p className="text-slate-500 text-xs">
                {new Date(message.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}

function MessageDetailModal({
  message,
  onClose,
}: {
  message: FeedbackMessage;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Сообщение</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <User className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{message.name}</h3>
                <div className="flex items-center text-slate-400 text-sm">
                  <Mail className="w-3 h-3 mr-1" />
                  {message.email}
                </div>
                {message.company && (
                  <div className="text-slate-400 text-xs mt-1">
                    Компания: {message.company}
                  </div>
                )}
                {message.service && (
                  <div className="text-slate-400 text-xs">
                    Услуга: {getServiceLabel(message.service)}
                  </div>
                )}
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              {new Date(message.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Сообщение</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Статус</h3>
            <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg">
              <span className="text-white">
                {message.status === 'new' && 'Новое'}
                {message.status === 'read' && 'Прочитано'}
                {message.status === 'replied' && 'Отвечено'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
