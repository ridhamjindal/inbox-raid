import { EmailEnemy, EnemyCategory } from '../types/index.js';

const DEMO_EMAILS: Array<{
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  category: EnemyCategory;
  enemyType: 'Drone' | 'Scout' | 'Alien' | 'Cruiser' | 'Boss';
  hp: number;
  points: number;
  weakness?: string;
}> = [
  {
    sender: 'MegaStore Deals',
    senderEmail: 'offers@megastore.com',
    subject: '🔥 FLASH SALE: 80% OFF EVERYTHING TODAY ONLY!',
    snippet: 'Don’t miss out on giant discounts on tech, apparel, and home goods. Click now to claim your coupon code FLASH80.',
    category: 'PROMOTIONAL',
    enemyType: 'Drone',
    hp: 1,
    points: 100,
    weakness: 'Unsubscribe'
  },
  {
    sender: 'DevWeekly Digest',
    senderEmail: 'newsletter@devweekly.io',
    subject: 'Issue #342: The Future of AI Game Engines & WebGL in 2026',
    snippet: 'In this issue: 10 trends changing fullstack dev, top open-source tools, and how to build arcade UI in React.',
    category: 'NEWSLETTER',
    enemyType: 'Boss',
    hp: 8,
    points: 1000,
    weakness: 'Read Later'
  },
  {
    sender: 'Linkedin Updates',
    senderEmail: 'notifications@linkedin.com',
    subject: 'You have 14 new profile views this week',
    snippet: 'See who is viewing your profile, plus 5 job recommendations matching your Software Architect profile.',
    category: 'SOCIAL',
    enemyType: 'Scout',
    hp: 2,
    points: 250,
  },
  {
    sender: 'Cryptic Crypto Bot',
    senderEmail: 'claim-reward-9923@airdrop-claim-now.xyz',
    subject: 'URGENT: Your 5000 USDT Airdrop is waiting to be claimed',
    snippet: 'Your wallet has been selected for exclusive reward distribution. Connect your wallet within 2 hours.',
    category: 'SPAM',
    enemyType: 'Alien',
    hp: 3,
    points: 400,
    weakness: 'Spam Blast'
  },
  {
    sender: 'Project Lead',
    senderEmail: 'alex@outlier-hackathon.org',
    subject: 'PromptWars Hackathon: Demo Submission Guidelines & Review',
    snippet: 'Please verify all repository guidelines before final presentation. Ensure your Gmail live demo handles auth gracefully.',
    category: 'IMPORTANT',
    enemyType: 'Cruiser',
    hp: 5,
    points: 600,
    weakness: 'Priority Strike'
  }
];

export class MockEmailService {
  static getMockEmails(count = 10): EmailEnemy[] {
    const list: EmailEnemy[] = [];
    for (let i = 0; i < count; i++) {
      const template = DEMO_EMAILS[i % DEMO_EMAILS.length];
      list.push({
        id: `mock_msg_${Date.now()}_${i + 1}`,
        threadId: `mock_thread_${i + 1}`,
        sender: template.sender,
        senderEmail: template.senderEmail,
        subject: template.subject,
        snippet: template.snippet,
        receivedAt: new Date(Date.now() - i * 3600000).toISOString(),
        category: template.category,
        enemyType: template.enemyType,
        hp: template.hp,
        maxHp: template.hp,
        points: template.points,
        weakness: template.weakness
      });
    }
    return list;
  }
}
