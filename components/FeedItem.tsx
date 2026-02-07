
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { MOODS, REACTIONS } from '../constants';
import { formatDistanceToNow } from 'date-fns';

interface FeedItemProps {
  post: Post;
  onReact: (postId: string, reactionEmoji: string) => void;
  isDarkMode: boolean;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, onReact, isDarkMode }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const mood = MOODS.find(m => m.id === post.moodId);

  const handleFloatingReaction = (emoji: string) => {
    // Simulate haptic feedback
    if ('vibrate' in navigator) navigator.vibrate(10);
    
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji, x: 20 + Math.random() * 60 }]);
    onReact(post.id, emoji);
    
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  return (
    <div className={`relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-[2.5rem] group transition-colors shadow-sm ${
      isDarkMode ? 'bg-zinc-900' : 'bg-zinc-200'
    }`}>
      <img 
        src={post.photoUrl} 
        alt="Moodshot" 
        className="w-full h-full object-cover"
        onDoubleClick={() => handleFloatingReaction('🤍')}
      />

      {/* Floating Emojis Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map(fe => (
          <div
            key={fe.id}
            className="absolute bottom-10 text-4xl animate-float-up opacity-0"
            style={{ left: `${fe.x}%` }}
          >
            {fe.emoji}
          </div>
        ))}
      </div>
      
      {/* Bottom info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-lg">{mood?.emoji}</span>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium tracking-tight">{post.userName}</span>
              <span className="text-zinc-400 text-[10px] uppercase tracking-[0.1em]">
                {formatDistanceToNow(post.timestamp)} ago
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {post.reactions.slice(-3).map((r, i) => (
              <span key={i} className="text-sm opacity-70 animate-pulse">{r}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Reactions Tray */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => setShowReactions(!showReactions)}
          className={`w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
            isDarkMode 
              ? 'bg-black/40 border-white/10 text-white' 
              : 'bg-white/40 border-black/10 text-zinc-900'
          }`}
        >
          {REACTIONS[0].emoji}
        </button>
        
        {showReactions && (
          <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
            {REACTIONS.map((r) => (
              <button 
                key={r.id}
                onClick={() => {
                  handleFloatingReaction(r.emoji);
                  setShowReactions(false);
                }}
                className={`w-11 h-11 rounded-full border flex items-center justify-center backdrop-blur-md hover:scale-110 active:scale-90 transition-all ${
                  isDarkMode 
                    ? 'bg-black/60 border-white/10 text-white' 
                    : 'bg-white/60 border-black/10 text-zinc-900'
                }`}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-20px) scale(1.2); }
          100% { transform: translateY(-150px) scale(1); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedItem;
