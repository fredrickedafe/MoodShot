
import React, { useState } from 'react';
import { User, SexType } from '../types';
import { MOODSHOT_LOGO } from '../logo';

interface AuthProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isDarkMode }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState<string | null>(null);

  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter your credentials.");
      return;
    }

    if (isRegistering) {
      if (!dob) {
        setError("Please enter your date of birth.");
        return;
      }

      const birthDate = new Date(dob);
      const age = calculateAge(birthDate);

      if (age < 13) {
        setError("You must be at least 13 years old to join MoodShot.");
        return;
      }
    }

    // Simulated Auth
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: username.toLowerCase().replace(/\s/g, ''),
      displayName: username,
      dob: dob || new Date(1995, 0, 1).toISOString(),
      innerCircleIds: [],
      streakCount: 0,
      sex: 'unspecified'
    };
    
    onLogin(newUser);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-8 transition-colors duration-500 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <div className="w-full max-w-xs space-y-8 flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-purple-600 to-indigo-900 rounded-[2rem] shadow-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-[5px] border-white/90 rounded-full flex items-center justify-center relative">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-orange-400 rounded-full clip-path-moon"></div>
                </div>
                <div className="absolute -top-1 -left-1 text-white">❤️</div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-light tracking-tighter mb-2">MoodShot</h1>
          <p className="text-sm text-zinc-500 font-light">Presence, captured simply.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full h-14 px-6 rounded-2xl border transition-all outline-none ${
                isDarkMode 
                  ? 'bg-zinc-900 border-white/5 focus:border-white/20 text-white' 
                  : 'bg-white border-zinc-200 focus:border-zinc-400 text-zinc-900'
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-14 px-6 rounded-2xl border transition-all outline-none ${
                isDarkMode 
                  ? 'bg-zinc-900 border-white/5 focus:border-white/20 text-white' 
                  : 'bg-white border-zinc-200 focus:border-zinc-400 text-zinc-900'
              }`}
            />
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-4">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full h-14 px-6 rounded-2xl border transition-all outline-none ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-white/5 focus:border-white/20 text-white' 
                      : 'bg-white border-zinc-200 focus:border-zinc-400 text-zinc-900'
                  }`}
                />
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center px-2 animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            className={`w-full h-14 rounded-full font-medium transition-transform active:scale-95 ${
              isDarkMode ? 'bg-white text-black' : 'bg-zinc-900 text-white'
            }`}
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-xs text-zinc-500 hover:text-zinc-400 underline underline-offset-4"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Join the collective"}
          </button>
        </div>
      </div>

      <style>{`
        .clip-path-moon {
          clip-path: ellipse(80% 80% at 20% 20%);
        }
      `}</style>
    </div>
  );
};

export default Auth;
