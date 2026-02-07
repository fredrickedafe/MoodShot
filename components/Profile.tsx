
import React, { useState, useEffect } from 'react';
import { Post, User, SexType } from '../types';
import { MOODS, COUNTRIES, SEX_OPTIONS } from '../constants';
import { getMoodInsight } from '../services/geminiService';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Moon, Sun, LogOut, Flame, Shield, Edit2, Check, Camera, X } from 'lucide-react';

interface ProfileProps {
  currentUser: User;
  posts: Post[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLogout: () => void;
  onToggleInnerCircle: (targetUserId: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, posts, isDarkMode, setIsDarkMode, onLogout, onToggleInnerCircle, onUpdateUser }) => {
  const [insight, setInsight] = useState<string>("Analyzing your week...");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>(currentUser);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const myPosts = posts.filter(p => p.userId === currentUser.id);
  
  const otherUsers = posts
    .filter((p, index, self) => 
      p.userId !== currentUser.id && 
      index === self.findIndex((t) => t.userId === p.userId)
    )
    .map(p => ({ id: p.userId, name: p.userName }));

  useEffect(() => {
    const history = myPosts.map(p => ({
      mood: MOODS.find(m => m.id === p.moodId)?.label || '',
      date: new Date(p.timestamp).toLocaleDateString()
    }));
    getMoodInsight(history).then(setInsight);
  }, [myPosts.length]);

  const moodCounts = MOODS.map(m => ({
    name: m.label,
    count: myPosts.filter(p => p.moodId === m.id).length,
    emoji: m.emoji
  })).filter(item => item.count > 0);

  // Fix: calculateAge now accepts string or Date to prevent type errors when called with a Date object in the onChange handler
  const calculateAge = (dobInput: string | Date) => {
    const dob = new Date(dobInput);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSaveProfile = () => {
    onUpdateUser({ ...currentUser, ...editForm } as User);
    setIsEditing(false);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  if (isEditing) {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
        <header className={`p-6 flex items-center justify-between border-b ${isDarkMode ? 'border-white/5' : 'border-zinc-200'}`}>
          <button onClick={() => setIsEditing(false)} className="text-zinc-500">
            <X size={24} />
          </button>
          <h2 className="text-sm font-medium tracking-tight">Edit Profile</h2>
          <button onClick={handleSaveProfile} className="text-blue-500 font-medium flex items-center gap-1">
            <Check size={20} /> Save
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl border relative group ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-zinc-200 border-zinc-300'}`}>
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} className="w-full h-full rounded-full object-cover" alt="Avatar" />
              ) : (
                currentUser.displayName[0].toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Change Picture</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                className={`w-full h-14 px-6 rounded-2xl border outline-none ${isDarkMode ? 'bg-zinc-900 border-white/5 focus:border-white/20' : 'bg-white border-zinc-200 focus:border-zinc-400'}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Display Name</label>
              <input
                type="text"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                className={`w-full h-14 px-6 rounded-2xl border outline-none ${isDarkMode ? 'bg-zinc-900 border-white/5 focus:border-white/20' : 'bg-white border-zinc-200 focus:border-zinc-400'}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Full Name (Private)</label>
              <input
                type="text"
                value={editForm.fullName || ''}
                placeholder="Optional"
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className={`w-full h-14 px-6 rounded-2xl border outline-none ${isDarkMode ? 'bg-zinc-900 border-white/5 focus:border-white/20' : 'bg-white border-zinc-200 focus:border-zinc-400'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Country</label>
                <select
                  value={editForm.country || ''}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  className={`w-full h-14 px-6 rounded-2xl border outline-none appearance-none ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}
                >
                  <option value="">Select...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Sex</label>
                <select
                  value={editForm.sex || 'unspecified'}
                  onChange={(e) => setEditForm({ ...editForm, sex: e.target.value as SexType })}
                  className={`w-full h-14 px-6 rounded-2xl border outline-none appearance-none ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}
                >
                  {SEX_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4 font-bold">Date of Birth</label>
              <input
                type="date"
                value={editForm.dob ? editForm.dob.split('T')[0] : ''}
                onChange={(e) => {
                  const birthDate = new Date(e.target.value);
                  const age = calculateAge(birthDate);
                  if (age >= 13) {
                    setEditForm({ ...editForm, dob: birthDate.toISOString() });
                  }
                }}
                className={`w-full h-14 px-6 rounded-2xl border outline-none ${isDarkMode ? 'bg-zinc-900 border-white/5 focus:border-white/20' : 'bg-white border-zinc-200 focus:border-zinc-400'}`}
              />
              <p className="text-[9px] text-zinc-500 ml-4 uppercase tracking-tighter">Changing DOB may affect account eligibility.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-28 px-6 overflow-y-auto hide-scrollbar">
      {saveFeedback && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-full shadow-2xl z-[200] animate-in slide-in-from-top duration-300">
          Profile Updated
        </div>
      )}

      <header className="py-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border ${isDarkMode ? 'bg-zinc-900 border-white/5' : 'bg-zinc-200 border-zinc-300'}`}>
              {currentUser.displayName[0].toUpperCase()}
            </div>
            <div>
              <h1 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{currentUser.displayName}</h1>
              <p className="text-xs text-zinc-500 font-light italic">@{currentUser.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className={`p-2.5 rounded-full transition-all duration-300 border ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border-white/5' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
            >
              <Edit2 size={18} />
            </button>
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-full transition-all duration-300 border ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border-white/5' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={onLogout}
              className={`p-2.5 rounded-full transition-all duration-300 border ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border-white/5' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-3xl border flex items-center gap-3 ${isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200'}`}>
            <div className="text-orange-500"><Flame size={20} /></div>
            <div>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{currentUser.streakCount}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Streak</p>
            </div>
          </div>
          <div className={`p-4 rounded-3xl border flex items-center gap-3 ${isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200'}`}>
            <div className="text-blue-500"><Shield size={20} /></div>
            <div>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{currentUser.innerCircleIds.length}/5</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Circle</p>
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border transition-colors ${isDarkMode ? 'bg-zinc-900 border-white/5 shadow-inner' : 'bg-zinc-100 border-zinc-200'}`}>
          <div className="flex items-center justify-between mb-3 border-b border-zinc-500/10 pb-2">
             <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">Private Resonance</span>
             <span className="text-[9px] text-zinc-400 font-mono">{calculateAge(currentUser.dob)} Years Old</span>
          </div>
          <p className={`text-sm leading-relaxed italic ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
            "{insight}"
          </p>
          {(currentUser.country || currentUser.sex !== 'unspecified') && (
            <div className="mt-4 flex gap-3 text-[9px] uppercase tracking-widest font-bold text-zinc-500 opacity-60">
              {currentUser.country && <span>📍 {currentUser.country}</span>}
              {currentUser.sex !== 'unspecified' && <span>👤 {currentUser.sex}</span>}
            </div>
          )}
        </div>
      </header>

      {/* Analytics */}
      <section className="mb-10">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4">Weekly Resonance</h2>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodCounts}>
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {moodCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={isDarkMode ? "#3f3f46" : "#d1d5db"} />
                ))}
              </Bar>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`p-2 px-3 rounded-full border text-[10px] shadow-xl ${isDarkMode ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}>
                        {payload[0].payload.emoji} {payload[0].payload.name} ({payload[0].value})
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Inner Circle Management */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Inner Circle</h2>
          <span className="text-[10px] text-zinc-400">Private to you</span>
        </div>
        <div className="flex flex-col gap-2">
          {otherUsers.map(u => {
            const isCircle = currentUser.innerCircleIds.includes(u.id);
            return (
              <div key={u.id} className={`flex items-center justify-between p-3 px-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-zinc-900/30 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">👤</div>
                  <span className={`text-sm ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>{u.name}</span>
                </div>
                <button 
                  onClick={() => onToggleInnerCircle(u.id)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-tighter transition-all ${
                    isCircle 
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                      : 'bg-zinc-800 text-zinc-400 border border-transparent'
                  }`}
                >
                  {isCircle ? 'In Circle' : 'Add'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* History Grid */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4">Atmospheres</h2>
        {myPosts.length === 0 ? (
          <div className={`aspect-square flex items-center justify-center border-2 border-dashed rounded-[2rem] ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <p className="text-zinc-500 text-sm font-light">The archive is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {myPosts.map(post => (
              <div key={post.id} className="aspect-square relative rounded-2xl overflow-hidden group shadow-sm">
                <img src={post.photoUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="History" />
                <div className={`absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors`}></div>
                <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px]">
                  {MOODS.find(m => m.id === post.moodId)?.emoji}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
