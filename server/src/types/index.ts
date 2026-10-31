export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isDemo: boolean;
}

export type EnemyCategory = 'PROMOTIONAL' | 'SOCIAL' | 'SPAM' | 'IMPORTANT' | 'NEWSLETTER';

export interface EmailEnemy {
  id: string;
  threadId: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  category: EnemyCategory;
  enemyType: 'Drone' | 'Scout' | 'Alien' | 'Cruiser' | 'Boss';
  hp: number;
  maxHp: number;
  points: number;
  weakness?: string;
}

export interface ArchiveResult {
  success: boolean;
  archivedIds: string[];
  count: number;
  isDemo: boolean;
}

export interface GameScore {
  userId: string;
  playerName: string;
  score: number;
  emailsArchived: number;
  bossesDefeated: number;
  highestCombo: number;
  timestamp: string;
}
