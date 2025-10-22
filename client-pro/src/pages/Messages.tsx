import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, User, Search, Phone, Video, MoreVertical, 
  Image, Paperclip, Smile, Mic, Clock, Check, CheckCheck, Info, ArrowLeft
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  manager: string;
  status: 'active' | 'inactive';
}

interface ChatMessage {
  id: string;
  sender: 'client' | 'manager';
  sender_name: string;
  message: string;
  timestamp: string;
  project_id: number;
}

const mockProjects: Project[] = [
  { id: 1, name: 'E-commerce Platform', manager: 'Алексей Иванов', status: 'active' },
  { id: 2, name: 'Mobile Banking App', manager: 'Мария Петрова', status: 'active' },
  { id: 3, name: 'AI Chatbot Integration', manager: 'Дмитрий Сидоров', status: 'inactive' },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'manager',
    sender_name: 'Алексей Иванов',
    message: 'Добрый день! Как вам последние изменения в дизайне?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    project_id: 1
  },
  {
    id: '2',
    sender: 'client',
    sender_name: 'Вы',
    message: 'Здравствуйте! Дизайн выглядит отлично, мне очень нравится.',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    project_id: 1
  },
  {
    id: '3',
    sender: 'manager',
    sender_name: 'Алексей Иванов',
    message: 'Отлично! Тогда переходим к следующему этапу - разработке функционала корзины.',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    project_id: 1
  },
  {
    id: '4',
    sender: 'client',
    sender_name: 'Вы',
    message: 'Хорошо, когда планируете завершить этот этап?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    project_id: 1
  },
  {
    id: '5',
    sender: 'manager',
    sender_name: 'Алексей Иванов',
    message: 'Планируем завершить к концу недели. Буду держать вас в курсе прогресса.',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    project_id: 1
  },
  {
    id: '6',
    sender: 'manager',
    sender_name: 'Мария Петрова',
    message: 'Приложение прошло все тесты успешно! Готовы к релизу.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    project_id: 2
  },
  {
    id: '7',
    sender: 'client',
    sender_name: 'Вы',
    message: 'Отличные новости! Когда планируется публикация?',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    project_id: 2
  },
];

export function Messages() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter projects based on search
  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for selected project
  const projectMessages = selectedProject
    ? messages.filter(m => m.project_id === selectedProject.id)
    : [];

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [projectMessages]);

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowMobileChat(true);
  };

  // Handle back to projects list on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedProject(null);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedProject) return;
    
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      sender: 'client',
      sender_name: 'Вы',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      project_id: selectedProject.id
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
    
    // Simulate manager response after a delay
    setTimeout(() => {
      const responses = [
        'Спасибо за обратную связь!',
        'Хорошо, учтем ваши пожелания.',
        'Понятно, работаем над этим.',
        'Отлично, обсудим детали позже.',
        'Хорошо, я свяжусь с командой.'
      ];
      
      const managerResponse: ChatMessage = {
        id: `new-${Date.now() + 1}`,
        sender: 'manager',
        sender_name: selectedProject.manager,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        project_id: selectedProject.id
      };
      
      setMessages(prev => [...prev, managerResponse]);
    }, 2000);
  };

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + 
             ', ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('ru-RU');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(projectMessages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Сообщения</h1>
        <p className="text-dark-300">Общение с менеджерами проектов</p>
      </div>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full relative">
          {/* Projects sidebar */}
          <div className={`w-full lg:w-80 border-r border-dark-700 flex flex-col ${
            showMobileChat ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-dark-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-dark-400" />
                </div>
                <input
                  type="text"
                  placeholder="Поиск проектов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => {
                    const lastMessage = messages
                      .filter(m => m.project_id === project.id)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                    
                    const hasUnread = messages.some(m => 
                      m.project_id === project.id && 
                      m.sender === 'manager' && 
                      new Date(m.timestamp) > new Date(Date.now() - 86400000)
                    );
                    
                    return (
                      <button
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className={`w-full p-3 rounded-xl flex items-center space-x-3 transition ${
                          selectedProject?.id === project.id
                            ? 'bg-primary-600/20 border border-primary-500/30'
                            : 'hover:bg-dark-700'
                        } ${isLoading ? 'opacity-0' : 'animate-fade-in'}`}
                        style={{ animationDelay: '100ms' }}
                      >
                        <div className="avatar avatar-md relative">
                          <span>{project.name[0]}</span>
                          {project.status === 'active' && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></span>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <p className="text-white font-medium text-sm">{project.name}</p>
                            {lastMessage && (
                              <p className="text-dark-400 text-xs">
                                {formatMessageTime(lastMessage.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-dark-300 text-xs truncate max-w-[180px]">
                              {lastMessage ? lastMessage.message : project.manager}
                            </p>
                            {hasUnread && (
                              <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                1
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-dark-400">Проекты не найдены</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${
            showMobileChat ? 'absolute inset-0 z-10 bg-dark-800 lg:relative lg:z-0' : 'hidden lg:flex'
          }`}>
            {selectedProject ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-dark-700 bg-dark-800/80 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Back button for mobile */}
                    <button
                      onClick={handleBackToList}
                      className="lg:hidden btn btn-icon btn-secondary p-2 flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="avatar avatar-md flex-shrink-0">
                      <span>{selectedProject.name[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{selectedProject.name}</h3>
                      <p className="text-dark-300 text-xs sm:text-sm truncate">
                        Менеджер: {selectedProject.manager}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                    <button className="btn btn-icon btn-secondary p-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button className="btn btn-icon btn-secondary p-2">
                      <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button className="btn btn-icon btn-secondary p-2 hidden sm:flex">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-dark-800/30">
                  {Object.entries(messageGroups).map(([date, messages]) => (
                    <div key={date} className="space-y-2 sm:space-y-4">
                      <div className="flex justify-center">
                        <span className="bg-dark-700 text-dark-300 text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs">
                          {date}
                        </span>
                      </div>
                      
                      {messages.map((msg, index) => {
                        // Определяем, нужно ли показывать аватар
                        // Показываем только для первого сообщения в группе или если предыдущее сообщение от другого отправителя
                        const showAvatar = index === 0 || 
                          (index > 0 && messages[index - 1].sender !== msg.sender);
                        
                        // Определяем, нужно ли добавлять больший отступ между сообщениями разных отправителей
                        const isNewSender = index > 0 && messages[index - 1].sender !== msg.sender;
                        
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'} items-end ${
                              isNewSender ? 'mt-3 sm:mt-4' : 'mt-1 sm:mt-2'
                            }`}
                          >
                            {msg.sender === 'manager' && showAvatar ? (
                              <div className="avatar avatar-sm mr-1.5 sm:mr-2 flex-shrink-0">
                                <span>{msg.sender_name[0]}</span>
                              </div>
                            ) : msg.sender === 'manager' && (
                              <div className="w-6 sm:w-8 mr-1.5 sm:mr-2 flex-shrink-0" />
                            )}
                            
                            <div 
                              className={`max-w-[75%] sm:max-w-[70%] md:max-w-md ${
                                msg.sender === 'client' 
                                  ? 'bg-primary-600 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
                                  : 'bg-dark-700 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
                              } px-3 py-2 sm:px-4 sm:py-3`}
                            >
                              <p className="text-white break-words text-sm sm:text-base">{msg.message}</p>
                              <div className="flex items-center justify-end mt-0.5 sm:mt-1 space-x-1">
                                <p className="text-[10px] sm:text-xs text-dark-300">
                                  {formatMessageTime(msg.timestamp)}
                                </p>
                                {msg.sender === 'client' && (
                                  <CheckCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-dark-300" />
                                )}
                              </div>
                            </div>
                            
                            {msg.sender === 'client' && showAvatar ? (
                              <div className="avatar avatar-sm ml-1.5 sm:ml-2 flex-shrink-0">
                                <span>И</span>
                              </div>
                            ) : msg.sender === 'client' && (
                              <div className="w-6 sm:w-8 ml-1.5 sm:ml-2 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-2 sm:p-4 border-t border-dark-700 bg-dark-800/80 backdrop-blur-md">
                  <div className="flex items-end space-x-1 xs:space-x-2">
                    {/* Input container */}
                    <div className="flex-1 bg-dark-700 rounded-3xl border border-dark-600 focus-within:border-primary-500 transition-colors relative">
                      {/* Emoji picker */}
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 bg-dark-700 rounded-2xl border border-dark-600 p-3 shadow-xl animate-fade-in z-50">
                          <div className="grid grid-cols-8 gap-2">
                            {['😊', '👍', '❤️', '😂', '🎉', '👏', '🙏', '💯', '🔥', '✅', '⭐', '❓', '😍', '🤔', '😎', '🥳'].map(emoji => (
                              <button 
                                key={emoji}
                                className="w-10 h-10 hover:bg-dark-600 rounded-xl flex items-center justify-center text-xl transition-colors"
                                onClick={() => {
                                  setMessage(prev => prev + emoji);
                                  setShowEmojiPicker(false);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-end">
                        {/* Paperclip button inside textarea */}
                        <button 
                          className="btn btn-icon btn-secondary p-1 xs:p-1.5 sm:p-2 ml-1 mb-2 flex-shrink-0"
                        >
                          <Paperclip className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        <textarea
                          ref={textareaRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 bg-transparent border-none px-2 py-3 text-white placeholder-dark-400 focus:outline-none resize-none scrollbar-hide"
                          placeholder="Сообщение"
                          rows={1}
                          style={{
                            minHeight: '44px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                          }}
                        />
                        
                        <button 
                          className="btn btn-icon btn-secondary p-1 xs:p-1.5 sm:p-2 mr-1 xs:mr-2 mb-2 flex-shrink-0"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Send button - only visible when there's text */}
                    {message.trim() && (
                      <button 
                        className="p-1 xs:p-2 sm:p-3 rounded-full flex-shrink-0 self-end mb-0.5 transition-all bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-glow-sm animate-fade-in"
                        onClick={handleSendMessage}
                      >
                        <Send className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-dark-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Выберите проект</h3>
                  <p className="text-dark-300">Выберите проект из списка слева для начала общения</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
