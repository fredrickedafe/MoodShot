
import React, { useState, useRef, useEffect } from 'react';
import { X, SendHorizontal } from 'lucide-react';
import { User, ChatMessage, SharedChat as SharedChatType } from '../types';

interface SharedChatProps {
  chat: SharedChatType;
  currentUser: User;
  onSendMessage: (text: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const SharedChat: React.FC<SharedChatProps> = ({ chat, currentUser, onSendMessage, onClose, isDarkMode }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const myMessageCount = chat.messages.filter(m => m.senderId === currentUser.id).length;
  const isLimitReached = myMessageCount >= 10;
  const totalLimitReached = chat.messages.length >= 20;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLimitReached || totalLimitReached) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`p-6 flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-zinc-200'}`}>
        <button onClick={onClose} className="p-2 -ml-2 text-zinc-500">
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-0.5">Quiet Connection</span>
          <span className="text-xs font-light opacity-60">Temporary Resonance</span>
        </div>
        <div className="w-10 text-right">
           <span className={`text-[10px] font-mono ${myMessageCount >= 8 ? 'text-orange-500' : 'text-zinc-500'}`}>
             {myMessageCount}/10
           </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 hide-scrollbar">
        {chat.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-10">
            <p className="text-sm italic font-light">Two souls, one mood. A fleeting window for few words.</p>
          </div>
        )}
        
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] px-5 py-3 rounded-3xl text-sm leading-relaxed ${
                isMe 
                  ? (isDarkMode ? 'bg-zinc-100 text-black' : 'bg-zinc-900 text-white')
                  : (isDarkMode ? 'bg-zinc-900 text-zinc-300 border border-white/5' : 'bg-white text-zinc-600 border border-zinc-200')
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <footer className={`p-6 pb-10 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={inputText}
            disabled={isLimitReached || totalLimitReached}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isLimitReached ? "Limit reached" : "Few words..."}
            className={`w-full h-14 pl-6 pr-14 rounded-full border outline-none transition-all ${
              isDarkMode 
                ? 'bg-zinc-900 border-white/5 focus:border-white/20 text-white placeholder:text-zinc-600' 
                : 'bg-white border-zinc-200 focus:border-zinc-400 text-zinc-900 placeholder:text-zinc-400'
            } ${isLimitReached || totalLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLimitReached || totalLimitReached}
            className={`absolute right-2 top-2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() && !isLimitReached 
                ? (isDarkMode ? 'bg-white text-black' : 'bg-zinc-900 text-white') 
                : 'bg-transparent text-zinc-600'
            }`}
          >
            <SendHorizontal size={18} />
          </button>
        </form>
        <p className="text-center mt-4 text-[9px] uppercase tracking-widest text-zinc-600 font-medium">
          {totalLimitReached ? "Chat has ended" : "Messages will vanish when the room closes"}
        </p>
      </footer>
    </div>
  );
};

export default SharedChat;
