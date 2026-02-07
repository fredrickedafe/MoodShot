
import React, { useState, useEffect } from 'react';
import { MOODS } from '../constants';
import { getDailyPrompt } from '../services/geminiService';
import { ChevronRight } from 'lucide-react';

interface MoodSelectionProps {
  photoUrl: string;
  onComplete: (moodId: string) => void;
}

const MoodSelection: React.FC<MoodSelectionProps> = ({ photoUrl, onComplete }) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Finding the light...");

  useEffect(() => {
    getDailyPrompt().then(setPrompt);
  }, []);

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[60] flex flex-col">
      <div className="relative h-2/3">
        <img src={photoUrl} className="w-full h-full object-cover" alt="Captured" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <p className="text-zinc-400 italic text-lg mb-2 font-light">"{prompt}"</p>
          <p className="text-white text-sm tracking-widest uppercase font-medium">Select your current resonance</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-4 gap-4">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMoodId(mood.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
                selectedMoodId === mood.id 
                ? 'bg-white text-black scale-105' 
                : 'bg-zinc-900 text-zinc-500'
              }`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-[10px] font-medium tracking-tight uppercase">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedMoodId && (
        <div className="p-6 bg-zinc-950 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={() => onComplete(selectedMoodId)}
            className="w-full h-14 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2"
          >
            Post Mood <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodSelection;
