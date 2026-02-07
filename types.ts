
export type MoodType = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

export type ReactionType = {
  id: string;
  emoji: string;
};

export type SexType = 'male' | 'female' | 'other' | 'unspecified';

export type User = {
  id: string;
  username: string;
  displayName: string;
  fullName?: string;
  avatarUrl?: string;
  dob: string; // ISO string
  country?: string;
  sex?: SexType;
  innerCircleIds: string[]; // Max 5
  streakCount: number;
  lastPostDate?: string; // YYYY-MM-DD
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
};

export type SharedChat = {
  id: string;
  participants: string[]; // User IDs
  moodId: string;
  messages: ChatMessage[];
  expiresAt: number;
};

export type Post = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photoUrl: string;
  moodId: string;
  timestamp: number;
  reactions: string[]; // List of reaction emojis sent to this post
};

export type ViewState = 'auth' | 'feed' | 'capture' | 'rooms' | 'profile' | 'chat';
