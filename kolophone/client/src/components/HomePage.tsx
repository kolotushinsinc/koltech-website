import { useState } from 'react';
import { Video, Plus, LogIn, Clock, Users, Sparkles } from 'lucide-react';

interface HomePageProps {
  onJoinRoom: (roomId: string) => void;
}

export default function HomePage({ onJoinRoom }: HomePageProps) {
  const [roomCode, setRoomCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    onJoinRoom(newRoomId);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      onJoinRoom(roomCode.trim());
    }
  };

  const recentMeetings = [
    { id: 1, title: 'Еженедельная встреча команды', time: '2 дня назад', participants: 8 },
    { id: 2, title: 'Презентация проекта', time: '5 дней назад', participants: 12 },
    { id: 3, title: 'Брейншторм идей', time: '1 неделя назад', participants: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Kolophone</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                О платформе
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Новое поколение видеосвязи</span>
              </div>
              <h2 className="text-5xl font-bold leading-tight">
                Встречайтесь<br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                  без границ
                </span>
              </h2>
              <p className="text-xl text-slate-400">
                Создавайте конференции, общайтесь с командой и делитесь идеями в премиальном качестве
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleCreateRoom}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Создать новую комнату</span>
              </button>

              {!showJoinInput ? (
                <button
                  onClick={() => setShowJoinInput(true)}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all hover:scale-[1.02] border border-slate-700/50"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Присоединиться к комнате</span>
                </button>
              ) : (
                <form onSubmit={handleJoinRoom} className="space-y-3">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Введите код комнаты"
                    className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder-slate-500"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!roomCode.trim()}
                      className="flex-1 px-6 py-3 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Присоединиться
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowJoinInput(false);
                        setRoomCode('');
                      }}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-all border border-slate-700/50"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-2 border border-slate-700/50">
                  <Video className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-400">HD качество</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-2 border border-slate-700/50">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-400">До 100 человек</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-2 border border-slate-700/50">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-400">Без лимитов</p>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Meetings */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Недавние встречи</span>
              </h3>
              <div className="space-y-3">
                {recentMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => onJoinRoom(`room-${meeting.id}`)}
                    className="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 rounded-xl p-4 transition-all hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{meeting.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{meeting.participants} участников</span>
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                        <Video className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Премиум возможности</h4>
                  <p className="text-sm text-slate-400">
                    Запись встреч, виртуальные фоны, совместная работа над документами и многое другое
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-12 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>© 2025 Kolophone. Видеосвязь нового поколения</p>
          <div className="flex items-center space-x-6">
            <button className="hover:text-white transition-colors">Конфиденциальность</button>
            <button className="hover:text-white transition-colors">Условия использования</button>
            <button className="hover:text-white transition-colors">Контакты</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
