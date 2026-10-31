export interface UserStats {
  unreadEmails: number;
  emailsArchived: number;
  level: number;
  currentXp: number;
  requiredXp: number;
  dailyStreak: number;
  username: string;
  avatarUrl: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  color: string;
}

export interface Activity {
  id: string;
  type: 'defeat' | 'xp' | 'achievement' | 'mission' | 'level';
  text: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  iconName: string;
}

export const MOCK_USER_STATS: UserStats = {
  unreadEmails: 1250,
  emailsArchived: 340,
  level: 8,
  currentXp: 4850,
  requiredXp: 5000,
  dailyStreak: 5,
  username: 'Inbox Raider',
  avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=raider123'
};

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'PROMOTION PURGE',
    description: 'Defeat promotional email monsters.',
    reward: 100,
    difficulty: 'Easy',
    progress: 65,
    color: 'arcade-neonCyan'
  },
  {
    id: 'm2',
    title: 'NEWSLETTER NIGHTMARE',
    description: 'Clear unwanted newsletter enemies.',
    reward: 250,
    difficulty: 'Medium',
    progress: 30,
    color: 'arcade-electricPurple'
  },
  {
    id: 'm3',
    title: 'THE INBOX BOSS',
    description: 'Challenge the giant unread email monster.',
    reward: 500,
    difficulty: 'Hard',
    progress: 0,
    color: 'arcade-neonPink'
  }
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 'a1', type: 'defeat', text: 'Defeated 15 promotional monsters', timestamp: '10 mins ago' },
  { id: 'a2', type: 'xp', text: 'Earned 100 XP', timestamp: '12 mins ago' },
  { id: 'a3', type: 'achievement', text: 'Unlocked Combo Master', timestamp: '1 hour ago' },
  { id: 'a4', type: 'mission', text: 'Completed Inbox Cleanup Mission', timestamp: '3 hours ago' },
  { id: 'a5', type: 'level', text: 'Reached Level 08', timestamp: '5 hours ago' }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', title: 'FIRST BLOOD', description: 'Archive your first email.', unlocked: true, iconName: 'Zap' },
  { id: 'ach2', title: 'EMAIL SLAYER', description: 'Archive 50 emails.', unlocked: true, iconName: 'Skull' },
  { id: 'ach3', title: 'COMBO MASTER', description: 'Complete 10 consecutive actions.', unlocked: true, iconName: 'Flame' },
  { id: 'ach4', title: 'BOSS DESTROYER', description: 'Complete a boss battle.', unlocked: false, iconName: 'Trophy' },
  { id: 'ach5', title: 'INBOX LEGEND', description: 'Reach Level 10.', unlocked: false, iconName: 'Shield' }
];
