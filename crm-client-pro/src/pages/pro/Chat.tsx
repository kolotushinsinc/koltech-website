import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, User, Search, Phone, Video, MoreVertical, 
  Image, Paperclip, Smile, Mic, Clock, Check, CheckCheck, Info
} from 'lucide-react';
import { mockClients, mockChatMessages, type Client, type ChatMessage } from '../../data/mockData';

export function Chat() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(mockClients[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for selected client
  const clientMessages = selectedClient
    ? messages.filter(m => m.client_id === selectedClient.id)
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
  }, [clientMessages]);

  // Simulate typing indicator
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedClient) return;
    
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      sender: 'employee',
      sender_name: 'Администратор',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      client_id: selectedClient.id
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate client response after a delay
    setTimeout(() => {
      const responses = [
        'Спасибо за информацию!',
        'Хорошо, буду ждать.',
        'Понятно, спасибо за ответ.',
        'Отлично, когда сможем обсудить детали?',
        'Хорошо, я свяжусь с вами позже.'
      ];
      
      const clientResponse: ChatMessage = {
        id: `new-${Date.now() + 1}`,
        sender: 'client',
        sender_name: selectedClient.name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        client_id: selectedClient.id
      };
      
      setMessages(prev => [...prev, clientResponse]);
    }, 3000);
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

  const messageGroups = groupMessagesByDate(clientMessages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Чат с заказчиками</h1>
        <p className="text-dark-300">Общение с клиентами в реальном времени</p>
      </div>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          {/* Clients sidebar */}
          <div className="w-80 border-r border-dark-700 flex flex-col">
            <div className="p-4 border-b border-dark-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-dark-400" />
                </div>
                <input
                  type="text"
                  placeholder="Поиск заказчиков..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => {
                    const lastMessage = messages
                      .filter(m => m.client_id === client.id)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                    
                    const hasUnread = messages.some(m => 
                      m.client_id === client.id && 
                      m.sender === 'client' && 
                      new Date(m.timestamp) > new Date(Date.now() - 86400000)
                    );
                    
                    return (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`w-full p-3 rounded-xl flex items-center space-x-3 transition ${
                          selectedClient?.id === client.id
                            ? 'bg-primary-600/20 border border-primary-500/30'
                            : 'hover:bg-dark-700'
                        } ${isLoading ? 'opacity-0' : 'animate-fade-in'}`}
                        style={{ animationDelay: '100ms' }}
                      >
                        <div className="avatar avatar-md relative">
                          <span>{client.name[0]}</span>
                          {client.status === 'active' && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></span>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <p className="text-white font-medium text-sm">{client.name}</p>
                            {lastMessage && (
                              <p className="text-dark-400 text-xs">
                                {formatMessageTime(lastMessage.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-dark-300 text-xs truncate max-w-[120px]">
                              {lastMessage ? lastMessage.message : client.company}
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
                    <p className="text-dark-400">Заказчики не найдены</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedClient ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-dark-700 bg-dark-800/80 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="avatar avatar-md">
                      <span>{selectedClient.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{selectedClient.name}</h3>
                      <p className="text-dark-300 text-sm flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        В сети
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="btn btn-icon btn-secondary p-2">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="btn btn-icon btn-secondary p-2">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="btn btn-icon btn-secondary p-2">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-800/30">
                  {Object.entries(messageGroups).map(([date, messages]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex justify-center">
                        <span className="bg-dark-700 text-dark-300 text-xs px-3 py-1 rounded-full">
                          {date}
                        </span>
                      </div>
                      
                      {messages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'employee' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender === 'client' && (
                            <div className="avatar avatar-sm mr-2 self-end mb-1">
                              <span>{msg.sender_name[0]}</span>
                            </div>
                          )}
                          
                          <div 
                            className={`max-w-md ${
                              msg.sender === 'employee' 
                                ? 'bg-primary-600 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
                                : 'bg-dark-700 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
                            } px-4 py-3`}
                          >
                            <p className="text-white">{msg.message}</p>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                              <p className="text-xs text-dark-300">
                                {formatMessageTime(msg.timestamp)}
                              </p>
                              {msg.sender === 'employee' && (
                                <CheckCheck className="w-3 h-3 text-dark-300" />
                              )}
                            </div>
                          </div>
                          
                          {msg.sender === 'employee' && (
                            <div className="avatar avatar-sm ml-2 self-end mb-1">
                              <span>А</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-dark-700 rounded-2xl px-4 py-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-dark-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-dark-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 bg-dark-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-dark-700 bg-dark-800/80 backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <button className="btn btn-icon btn-secondary p-2">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button 
                        className="btn btn-icon btn-secondary p-2 relative"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="w-5 h-5" />
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 mb-2 bg-dark-700 rounded-xl border border-dark-600 p-2 shadow-lg animate-fade-in">
                            <div className="grid grid-cols-6 gap-1">
                              {['😊', '👍', '❤️', '😂', '🎉', '👏', '🙏', '💯', '🔥', '✅', '⭐', '❓'].map(emoji => (
                                <button 
                                  key={emoji}
                                  className="w-8 h-8 hover:bg-dark-600 rounded-lg flex items-center justify-center text-lg"
                                  onClick={() => setMessage(prev => prev + emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="form-input flex-1"
                      placeholder="Напишите сообщение..."
                    />
                    
                    <button 
                      className="btn btn-primary px-6 py-3"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-dark-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Выберите заказчика</h3>
                  <p className="text-dark-300">Выберите заказчика из списка слева для начала общения</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
