import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MeetingRoom from './components/MeetingRoom';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for room ID in URL query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomParam = queryParams.get('room');
    
    if (roomParam) {
      console.log('Found room in URL:', roomParam);
      setCurrentRoom(roomParam);
      
      // Update browser history to remove query parameter
      // This prevents issues when refreshing the page while in a meeting
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, '', url);
    }
    
    setIsLoading(false);
  }, []);

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room:', roomId);
    setCurrentRoom(roomId);
  };

  const handleLeaveRoom = () => {
    console.log('Leaving room');
    setCurrentRoom(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-cyan-400 border-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (currentRoom) {
    return <MeetingRoom roomId={currentRoom} onLeave={handleLeaveRoom} />;
  }

  return <HomePage onJoinRoom={handleJoinRoom} />;
}

export default App;
