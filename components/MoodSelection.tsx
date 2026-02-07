
import React, { useState, useEffect } from 'react';
import { MOODS } from '../constants';
import { getDailyPrompt, suggestMood } from '../services/geminiService';
import { ChevronRight, Sparkles } from 'lucide-react';

interface MoodSelectionProps {
  photoUrl: string;
  onComplete: (moodId: string) => void;
}

const MoodSelection: React.FC<MoodSelectionProps> = ({ photoUrl, onComplete }) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [suggestedMoodId, setSuggestedMoodId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Finding the light...");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    getDailyPrompt().then(setPrompt);
    
    // AI Mood Suggestion
    suggestMood(photoUrl).then(moodId => {
      setSuggestedMoodId(moodId);
      setSelectedMoodId(moodId); // Auto-select the AI suggestion
      setIsAnalyzing(false);
    });
  }, [photoUrl]);

  return (
    <div className="fixed inset-0 bg-zinc-950 z-[60] flex flex-col">
      <div className="relative h-2/3">
        <img src={photoUrl} className="w-full h-full object-cover" alt="Captured" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <p className="text-zinc-400 italic text-lg mb-2 font-light">"{prompt}"</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            {isAnalyzing ? (
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] animate-pulse">Analyzing frequency...</span>
            ) : (
              <div className="flex items-center gap-1 text-blue-400/80 animate-in fade-in duration-700">
                <Sparkles size={12} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">AI Suggested Resonance</span>
              </div>
            )}
          </div>
          <p className="text-white text-sm tracking-widest uppercase font-medium">Select your current resonance</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
        <div className="grid grid-cols-4 gap-4">
          {MOODS.map((mood) => {
            const isSuggested = suggestedMoodId === mood.id;
            const isSelected = selectedMoodId === mood.id;
            
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMoodId(mood.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 relative ${
                  isSelected 
                  ? (isDarkMode ? 'bg-white text-black scale-105 shadow-xl' : 'bg-zinc-900 text-white scale-105') 
                  : 'bg-zinc-900/50 text-zinc-500 border border-white/5'
                }`}
              >
                {isSuggested && !isSelected && (
                  <div className="absolute -top-1 -right-1 text-blue-400 animate-pulse">
                    <Sparkles size={14} fill="currentColor" />
                  </div>
                )}
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-[10px] font-medium tracking-tight uppercase">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedMoodId && (
        <div className="p-6 bg-zinc-950 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={() => onComplete(selectedMoodId)}
            className="w-full h-14 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            Post Mood <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

// Internal detection helper for dark mode in this component since it's used inside a full black overlay
const isDarkMode = true; 

export default MoodSelection;
