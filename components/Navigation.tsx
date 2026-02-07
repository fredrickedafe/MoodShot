
import React from 'react';
import { Camera, LayoutGrid, User, CircleDot } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, isDarkMode }) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 h-20 backdrop-blur-md border-t flex items-center justify-around px-6 z-50 transition-colors duration-500 ${
      isDarkMode ? 'bg-black/80 border-white/5' : 'bg-white/80 border-zinc-200'
    }`}>
      <button 
        onClick={() => onViewChange('feed')}
        className={`p-2 transition-all ${
          currentView === 'feed' 
            ? (isDarkMode ? 'text-white' : 'text-zinc-900') 
            : 'text-zinc-500'
        }`}
      >
        <LayoutGrid size={24} strokeWidth={1.5} />
      </button>
      
      <button 
        onClick={() => onViewChange('capture')}
        className={`p-3 rounded-full transition-all ${
          currentView === 'capture' 
            ? (isDarkMode ? 'bg-white text-black scale-110' : 'bg-zinc-900 text-white scale-110') 
            : (isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-500')
        }`}
      >
        <Camera size={24} strokeWidth={1.5} />
      </button>

      <button 
        onClick={() => onViewChange('rooms')}
        className={`p-2 transition-all ${
          currentView === 'rooms' 
            ? (isDarkMode ? 'text-white' : 'text-zinc-900') 
            : 'text-zinc-500'
        }`}
      >
        <CircleDot size={24} strokeWidth={1.5} />
      </button>

      <button 
        onClick={() => onViewChange('profile')}
        className={`p-2 transition-all ${
          currentView === 'profile' 
            ? (isDarkMode ? 'text-white' : 'text-zinc-900') 
            : 'text-zinc-500'
        }`}
      >
        <User size={24} strokeWidth={1.5} />
      </button>
    </nav>
  );
};

export default Navigation;
