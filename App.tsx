
import React, { useState, useEffect, useCallback } from 'react';
import { Post, ViewState, User, SharedChat as SharedChatType, ChatMessage } from './types';
import Navigation from './components/Navigation';
import CameraCapture from './components/CameraCapture';
import MoodSelection from './components/MoodSelection';
import FeedItem from './components/FeedItem';
import MoodRooms from './components/MoodRooms';
import Profile from './components/Profile';
import Auth from './components/Auth';
import SharedChat from './components/SharedChat';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('auth');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeChat, setActiveChat] = useState<SharedChatType | null>(null);

  // Persistence Simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('moodshot_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('feed');
    }

    const mockPosts: Post[] = [
      { id: '1', userId: 'friend_1', userName: 'Luka', photoUrl: 'https://picsum.photos/seed/luka/600/800', moodId: 'calm', timestamp: Date.now() - 1000 * 60 * 30, reactions: ['🤍', '🌱'] },
      { id: '2', userId: 'friend_2', userName: 'Sia', photoUrl: 'https://picsum.photos/seed/sia/600/800', moodId: 'radiant', timestamp: Date.now() - 1000 * 60 * 60 * 2, reactions: ['✨'] },
      { id: '3', userId: 'friend_3', userName: 'Noa', photoUrl: 'https://picsum.photos/seed/noa/600/800', moodId: 'melancholy', timestamp: Date.now() - 1000 * 60 * 60 * 12, reactions: ['🫂'] },
      { id: '4', userId: 'friend_4', userName: 'Kael', photoUrl: 'https://picsum.photos/seed/kael/600/800', moodId: 'fluid', timestamp: Date.now() - 1000 * 60 * 60 * 4, reactions: ['🌊'] }
    ];
    setPosts(mockPosts);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('moodshot_user', JSON.stringify(user));
    setView('feed');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('moodshot_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('moodshot_user');
    setView('auth');
  };

  const handleCapture = (photoUrl: string) => {
    setCapturedImage(photoUrl);
  };

  const handlePostComplete = (moodId: string) => {
    if (!capturedImage || !currentUser) return;

    const today = new Date().toISOString().split('T')[0];
    let newStreak = currentUser.streakCount;

    if (currentUser.lastPostDate) {
      const last = new Date(currentUser.lastPostDate);
      const diff = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const updatedUser = { ...currentUser, streakCount: newStreak, lastPostDate: today };
    handleUpdateUser(updatedUser);

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      photoUrl: capturedImage,
      moodId,
      timestamp: Date.now(),
      reactions: []
    };

    setPosts(prev => [newPost, ...prev]);
    setCapturedImage(null);
    setView('feed');
  };

  const handleReact = (postId: string, reactionEmoji: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, reactions: [...post.reactions, reactionEmoji].slice(-10) } 
        : post
    ));
  };

  const handleStartChat = (targetUserId: string, moodId: string) => {
    if (!currentUser) return;
    const newChat: SharedChatType = {
      id: `chat-${Date.now()}`,
      participants: [currentUser.id, targetUserId],
      moodId,
      messages: [],
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    };
    setActiveChat(newChat);
    setView('chat');
  };

  const handleSendMessage = (text: string) => {
    if (!activeChat || !currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: Date.now()
    };
    setActiveChat({
      ...activeChat,
      messages: [...activeChat.messages, newMessage]
    });
  };

  const toggleInnerCircle = (targetId: string) => {
    if (!currentUser) return;
    const currentIds = currentUser.innerCircleIds;
    let newIds;
    if (currentIds.includes(targetId)) {
      newIds = currentIds.filter(id => id !== targetId);
    } else {
      if (currentIds.length >= 5) return;
      newIds = [...currentIds, targetId];
    }
    const updatedUser = { ...currentUser, innerCircleIds: newIds };
    handleUpdateUser(updatedUser);
  };

  if (view === 'auth') {
    return <Auth onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'feed':
        const filteredPosts = currentUser?.innerCircleIds.length 
          ? posts.filter(p => currentUser.innerCircleIds.includes(p.userId) || p.userId === currentUser.id)
          : posts;

        return (
          <div className="flex flex-col min-h-full px-5 pt-12 pb-24 max-w-lg mx-auto">
            <header className="mb-10 px-1 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-purple-600 to-indigo-900 rounded-2xl shadow-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-[2px] border-white/90 rounded-full flex items-center justify-center relative scale-75">
                      <div className="w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-orange-400 rounded-full" style={{ clipPath: 'ellipse(80% 80% at 20% 20%)' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-light tracking-tighter leading-none transition-colors ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>MoodShot</h1>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-black leading-none mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {currentUser?.innerCircleIds.length ? 'Inner Circle' : 'The Collective'}
                  </p>
                </div>
              </div>
              <div className={`text-[10px] font-mono mt-2 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-400'}`}>
                STREAK: {currentUser?.streakCount}
              </div>
            </header>
            
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
                <p className="font-light text-zinc-500">Silence in the circle.</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <FeedItem key={post.id} post={post} onReact={handleReact} isDarkMode={isDarkMode} />
              ))
            )}
          </div>
        );
      case 'rooms':
        return <MoodRooms posts={posts} currentUser={currentUser} isDarkMode={isDarkMode} onReact={handleReact} onStartChat={handleStartChat} />;
      case 'profile':
        return currentUser ? (
          <Profile 
            currentUser={currentUser} 
            posts={posts} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            onLogout={handleLogout}
            onToggleInnerCircle={toggleInnerCircle}
            onUpdateUser={handleUpdateUser}
          />
        ) : null;
      case 'chat':
        return activeChat && currentUser ? (
          <SharedChat 
            chat={activeChat} 
            currentUser={currentUser} 
            onSendMessage={handleSendMessage} 
            onClose={() => setView('rooms')} 
            isDarkMode={isDarkMode} 
          />
        ) : null;
      default:
        return null;
    }
  };

  if (view === 'capture') {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <CameraCapture 
          onCapture={handleCapture} 
          onCancel={() => setView('feed')} 
        />
        {capturedImage && (
          <MoodSelection 
            photoUrl={capturedImage} 
            onComplete={handlePostComplete} 
          />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <main className="max-w-md mx-auto min-h-screen">
        {renderContent()}
      </main>
      <Navigation currentView={view} onViewChange={setView} isDarkMode={isDarkMode} />
    </div>
  );
};

export default App;
