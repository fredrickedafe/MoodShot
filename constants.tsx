
import { MoodType, ReactionType } from './types';

export const MOODS: MoodType[] = [
  { id: 'calm', emoji: '🌿', label: 'Calm', color: 'bg-emerald-900/20' },
  { id: 'melancholy', emoji: '🌑', label: 'Melancholy', color: 'bg-slate-900/40' },
  { id: 'radiant', emoji: '✨', label: 'Radiant', color: 'bg-amber-900/20' },
  { id: 'fluid', emoji: '🌊', label: 'Fluid', color: 'bg-blue-900/20' },
  { id: 'heavy', emoji: '☁️', label: 'Heavy', color: 'bg-zinc-800' },
  { id: 'burning', emoji: '🔥', label: 'Burning', color: 'bg-orange-900/20' },
  { id: 'stormy', emoji: '🌪️', label: 'Stormy', color: 'bg-neutral-800' },
  { id: 'serene', emoji: '😌', label: 'Serene', color: 'bg-stone-800' },
];

export const REACTIONS: ReactionType[] = [
  { id: 'heart', emoji: '🤍' },
  { id: 'hug', emoji: '🫂' },
  { id: 'bolt', emoji: '⚡' },
  { id: 'sprout', emoji: '🌱' },
  { id: 'dizzy', emoji: '💫' },
];

export const DAILY_PROMPTS = [
  "What does silence feel like right now?",
  "Capturing a texture that matches your heartbeat.",
  "Look up. What's the mood of the sky?",
  "Find a shadow that feels like yours.",
  "What is the color of your current thought?",
  "Capture a glimpse of where you are standing.",
];

export const COUNTRIES = [
  "Algeria",
  "Argentina",
  "Australia",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Kenya",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Philippines",
  "Portugal",
  "Saudi Arabia",
  "Senegal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Uganda",
  "United Kingdom",
  "United States",
  "Other"
];

export const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' }
];
