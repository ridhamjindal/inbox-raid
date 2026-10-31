export type EmailCategory = 'PROMOTIONAL' | 'SPAM' | 'NEWSLETTER' | 'IMPORTANT' | 'OLD_UNREAD';

export type ImportanceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DemoEmail {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
  category: EmailCategory;
  unread: boolean;
  isArchived: boolean;
  importance: ImportanceLevel;
  enemyType: 'Drone' | 'Scout' | 'Alien' | 'Cruiser' | 'Boss';
  hp: number;
  maxHp: number;
  points: number;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  isDemo: boolean;
}
