
import React, { useState, useEffect, useRef } from 'react';
import { Post, MoodType, User } from '../types';
import { MOODS, REACTIONS } from '../constants';
import { ChevronLeft, MessageSquare } from 'lucide-react';

interface MoodRoomsProps {
  posts: Post[];
  currentUser: User | null;
  isDarkMode: boolean;
  onReact: (postId: string, reactionEmoji: string) => void;
  onStartChat: (targetUserId: string, moodId: string) => void;
}

interface Pulse {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

const RoomPost: React.FC<{ post: Post; mood: MoodType; onReact: (emoji: string) => void; isDarkMode: boolean }> = ({ post, mood, onReact, isDarkMode }) => {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const lastReactionCount = useRef(post.reactions.length);

  useEffect(() => {
    if (post.reactions.length > lastReactionCount.current) {
      const newEmoji = post.reactions[post.reactions.length - 1];
      const newPulse: Pulse = {
        id: Date.now() + Math.random(),
        emoji: newEmoji,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40
      };
      setPulses(prev => [...prev, newPulse]);
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== newPulse.id));
      }, 1500);
    }
    lastReactionCount.current = post.reactions.length;
  }, [post.reactions.length]);

  return (
    <div className="relative w-full aspect-[9/16] mb-8 snap-start rounded-[2.5rem] overflow-hidden shadow-2xl bg-zinc-900 group">
      <img src={post.photoUrl} className="w-full h-full object-cover" alt="Mood" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {pulses.map(pulse => (
          <div 
            key={pulse.id}
            className="absolute text-5xl animate-pulse-emoji select-none"
            style={{ 
              left: `${pulse.x}%`, 
              top: `${pulse.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {pulse.emoji}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl">
            {mood.emoji}
          </div>
          <div>
            <p className="text-white text-base font-medium">{post.userName}</p>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-light">Shared resonance</p>
          </div>
        </div>

        <div className="flex items-center justify-around bg-black/40 backdrop-blur-xl rounded-full py-3 border border-white/10">
          {REACTIONS.map(r => (
            <button
              key={r.id}
              onClick={() => onReact(r.emoji)}
              className="p-2 transition-transform active:scale-150 hover:scale-110"
            >
              <span className="text-2xl filter drop-shadow-sm">{r.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-emoji {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -80%) scale(1.5); opacity: 0; }
        }
        .animate-pulse-emoji {
          animation: pulse-emoji 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

const MoodRooms: React.FC<MoodRoomsProps> = ({ posts, currentUser, isDarkMode, onReact, onStartChat }) => {
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);

  const now = Date.now();
  const recentPosts = posts.filter(p => (now - p.timestamp) < 24 * 60 * 60 * 1000);
  
  const moodPopulations = MOODS.map(m => ({
    ...m,
    count: recentPosts.filter(p => p.moodId === m.id).length
  })).filter(m => m.count > 0);

  if (activeMood) {
    const roomPosts = recentPosts.filter(p => p.moodId === activeMood.id);
    const myPostInThisRoom = roomPosts.find(p => p.userId === currentUser?.id);
    
    // Check for "Resonance Matches": Someone else who posted the same mood within 2 hours of my post
    const potentialMatch = myPostInThisRoom ? roomPosts.find(p => 
      p.userId !== currentUser?.id && 
      Math.abs(p.timestamp - myPostInThisRoom.timestamp) < 2 * 60 * 60 * 1000
    ) : null;
    
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-black' : 'bg-zinc-100'}`}>
        <header className={`p-6 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-10 ${isDarkMode ? 'border-white/5 bg-black/60' : 'border-zinc-200 bg-white/60'}`}>
          <button onClick={() => setActiveMood(null)} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <span className={`text-sm font-light tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{activeMood.label} Room</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{roomPosts.length} souls resonance</span>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-xl">
            {activeMood.emoji}
          </div>
        </header>

        {potentialMatch && (
          <div className={`mx-4 mt-4 p-4 rounded-3xl border flex items-center justify-between animate-in fade-in slide-in-from-top duration-500 ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                {activeMood.emoji}
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{potentialMatch.userName} is also feeling {activeMood.label.toLowerCase()}.</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Shared Window Connection</p>
              </div>
            </div>
            <button 
              onClick={() => onStartChat(potentialMatch.userId, activeMood.id)}
              className={`p-3 rounded-full transition-all active:scale-90 ${isDarkMode ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}
            >
              <MessageSquare size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 snap-y snap-mandatory hide-scrollbar">
          {roomPosts.map(post => (
            <RoomPost 
              key={post.id} 
              post={post} 
              mood={activeMood} 
              onReact={(emoji) => onReact(post.id, emoji)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-24 px-6">
      <header className="py-12">
        <h1 className={`text-2xl font-light mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Resonance Rooms</h1>
        <p className="text-zinc-500 text-sm">Collective spaces for shared frequencies.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {moodPopulations.map(mood => (
          <button
            key={mood.id}
            onClick={() => setActiveMood(mood)}
            className={`w-full h-28 rounded-[2rem] border p-6 flex items-center justify-between transition-all active:scale-[0.98] ${
              isDarkMode 
                ? 'bg-zinc-900/50 border-white/5 hover:bg-zinc-900' 
                : 'bg-white border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-4xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                {mood.emoji}
              </div>
              <div className="text-left">
                <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{mood.label}</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{mood.count} souls present</p>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[...Array(Math.min(mood.count, 4))].map((_, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs backdrop-blur-sm ${
                  isDarkMode ? 'bg-zinc-800/80 border-zinc-950 text-zinc-400' : 'bg-zinc-100/80 border-white text-zinc-600'
                }`}>👤</div>
              ))}
            </div>
          </button>
        ))}
        
        {moodPopulations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-3xl ${isDarkMode ? 'bg-zinc-900 shadow-inner' : 'bg-zinc-200 shadow-inner'}`}>🌑</div>
            <p className="text-zinc-400 text-sm font-light">The collective is quiet right now.</p>
            <p className="text-zinc-600 text-xs mt-3 italic">Post a mood to begin a resonance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodRooms;
