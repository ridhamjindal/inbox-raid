import { DemoEmail, EmailCategory, ImportanceLevel } from '../types/index.js';

const STORAGE_KEY = 'inbox_raid_demo_emails_v1';

const RAW_MOCK_DATA: Array<Omit<DemoEmail, 'id' | 'unread' | 'isArchived'>> = [
  // PROMOTIONAL (12)
  {
    sender: 'MegaStore Flash Deals',
    senderEmail: 'offers@megastore.com',
    subject: '🔥 FLASH SALE: 80% OFF EVERYTHING TODAY ONLY!',
    snippet: 'Don’t miss out on giant discounts on tech, apparel, and home goods. Click now to claim your coupon code FLASH80.',
    date: '2026-10-31T09:15:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'CyberGear Outlets',
    senderEmail: 'deals@cybergear.io',
    subject: 'New Mechanical Keyboards & RGB Mats in Stock!',
    snippet: 'Upgrade your gaming setup with ultra-responsive switches and custom keycaps. Limited inventory available.',
    date: '2026-10-31T08:30:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'FlightFinder Deals',
    senderEmail: 'alerts@flightfinder.com',
    subject: '✈️ Secret Fares: Roundtrip to Tokyo for $420!',
    snippet: 'We found price drops on major airlines for spring travels. Book within 24 hours to lock in these low rates.',
    date: '2026-10-30T22:10:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'FitLife Gyms',
    senderEmail: 'memberships@fitlifegym.com',
    subject: 'Zero Join Fee! Start your 7-day VIP Pass Today',
    snippet: 'Get access to all premium fitness equipment, sauna, and group classes. No long-term commitment required.',
    date: '2026-10-30T19:45:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'CloudHost Pro',
    senderEmail: 'promo@cloudhostpro.net',
    subject: '50% off VPS Server Renewals - Extended Cyber Week',
    snippet: 'Scale your infrastructure with fast NVMe storage and global CDN endpoints at half price.',
    date: '2026-10-30T16:20:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'CourseAcademy',
    senderEmail: 'learning@courseacademy.com',
    subject: 'Master Fullstack AI Development for $9.99',
    snippet: 'Over 40 hours of practical tutorials on LLMs, React, and serverless architecture. Start learning today.',
    date: '2026-10-30T14:00:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'Gourmet Meal Kits',
    senderEmail: 'fresh@gourmetbox.com',
    subject: 'Claim 16 Free Meals across your first 4 boxes!',
    snippet: 'Chef-curated recipes delivered right to your door with pre-portioned fresh ingredients.',
    date: '2026-10-29T21:15:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'StreamMax Video',
    senderEmail: 'no-reply@streammax.com',
    subject: 'Coming Soon: Sci-Fi Blockbusters added to your library',
    snippet: 'Check out the new releases launching this month including exclusive cyber thrillers and anime series.',
    date: '2026-10-29T18:00:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'AudioVault Headphones',
    senderEmail: 'sales@audiovault.com',
    subject: 'Active Noise Cancelling Wireless Headphones - 40% Off',
    snippet: 'Experience studio-quality acoustic precision with long 40-hour battery life.',
    date: '2026-10-29T11:30:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'SmartHome Essentials',
    senderEmail: 'info@smarthomestore.com',
    subject: 'Automate your lighting: Smart Bulb Starter Bundles',
    snippet: 'Control ambient colors with voice assistants and energy-saving schedules.',
    date: '2026-10-28T15:10:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'CozyApparel',
    senderEmail: 'style@cozyapparel.shop',
    subject: 'Winter Hoodies & Jackets Collection drop',
    snippet: 'Stay warm with water-resistant insulated parkas and heavy fleece hoodies.',
    date: '2026-10-28T10:00:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },
  {
    sender: 'CoffeeRoasters Direct',
    senderEmail: 'beans@coffeeroasters.org',
    subject: 'Single-Origin Ethiopian Yirgacheffe Beans in stock',
    snippet: 'Freshly roasted with floral notes, citrus zest, and clean caramel finish.',
    date: '2026-10-27T17:45:00Z',
    category: 'PROMOTIONAL',
    importance: 'LOW',
    enemyType: 'Drone',
    hp: 1,
    maxHp: 1,
    points: 100
  },

  // SPAM (10)
  {
    sender: 'Cryptic Crypto Bot',
    senderEmail: 'claim-reward-9923@airdrop-claim-now.xyz',
    subject: 'URGENT: Your 5000 USDT Airdrop is waiting to be claimed',
    snippet: 'Your wallet has been selected for exclusive reward distribution. Connect your wallet within 2 hours.',
    date: '2026-10-31T07:45:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Inheritance Notification',
    senderEmail: 'barrister.james@offices-legal-int.xyz',
    subject: 'CONFIDENTIAL: Unclaimed Estate Distribution of $4.5M',
    snippet: 'I represent the estate of a late investor sharing your surname. Contact immediately for transfer details.',
    date: '2026-10-30T23:50:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Fast Loan Approvals',
    senderEmail: 'instant-cash@quick-loans-direct.site',
    subject: 'Pre-Approved for $25,000 Personal Loan - No Credit Check',
    snippet: 'Guaranteed same-day transfer directly into your account with flexible repayment options.',
    date: '2026-10-30T20:15:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Security Alert Spoof',
    senderEmail: 'verify-account@login-security-check.net',
    subject: 'CRITICAL: Account Suspended due to unauthorized login attempt',
    snippet: 'We detected suspicious activity from IP address 192.168.1.1. Click here to verify your credentials.',
    date: '2026-10-30T17:30:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Prize Winner Central',
    senderEmail: 'notifications@winner-luckydraw.online',
    subject: 'CONGRATULATIONS! You won a brand new 2026 Electric SUV',
    snippet: 'Your email was chosen in our annual global subscriber raffle. Confirm your address to ship your prize.',
    date: '2026-10-30T11:00:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'PharmDirect Online',
    senderEmail: 'orders@health-supplements-rx.info',
    subject: 'Re: Prescriptions delivered to your door discreetly',
    snippet: 'Save up to 90% on brand name medications with free international shipping on orders over $50.',
    date: '2026-10-29T14:20:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'SEO Rank Booster',
    senderEmail: 'john@top1-google-rankings.biz',
    subject: 'We guarantee Page 1 Google ranking for your domain in 7 days',
    snippet: 'Our automated backlinks service will bring 50,000 visitors to your website starting this week.',
    date: '2026-10-29T09:10:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Casino Royale Rewards',
    senderEmail: 'vip@jackpot-spin-win.mobi',
    subject: 'Claim 200 Free Spins + $500 Welcome Bonus Deposit Match',
    snippet: 'Play top slots and live dealer games online with instant cryptocurrency cashouts.',
    date: '2026-10-28T22:40:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Work From Home Lead',
    senderEmail: 'hr@passive-income-jobs.tech',
    subject: 'Earn $350/hour testing simple web apps from your smartphone',
    snippet: 'No prior experience required. Flexible working hours with weekly direct deposit payouts.',
    date: '2026-10-28T13:15:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },
  {
    sender: 'Survey Rewards Inc',
    senderEmail: 'payouts@opinion-rewards-club.cc',
    subject: '$100 Amazon Gift Card waiting for your 2-minute feedback',
    snippet: 'Complete our short shopper survey before midnight to claim your digital reward code.',
    date: '2026-10-27T08:50:00Z',
    category: 'SPAM',
    importance: 'LOW',
    enemyType: 'Alien',
    hp: 3,
    maxHp: 3,
    points: 300
  },

  // NEWSLETTERS (10)
  {
    sender: 'DevWeekly Digest',
    senderEmail: 'newsletter@devweekly.io',
    subject: 'Issue #342: The Future of AI Game Engines & WebGL in 2026',
    snippet: 'In this issue: 10 trends changing fullstack dev, top open-source tools, and how to build arcade UI in React.',
    date: '2026-10-31T06:00:00Z',
    category: 'NEWSLETTER',
    importance: 'MEDIUM',
    enemyType: 'Boss',
    hp: 5,
    maxHp: 5,
    points: 500
  },
  {
    sender: 'TechCrunch Daily',
    senderEmail: 'newsletters@techcrunch.com',
    subject: 'TC Daily: Startup Funding Surge & Autonomous Agent Frameworks',
    snippet: 'Today in tech: VCs deploy $12B into AI infrastructure, new quantum computing milestones, and startup showcase.',
    date: '2026-10-30T15:30:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Hacker News Weekly',
    senderEmail: 'digest@hackernewsletter.com',
    subject: 'Issue #620: SQLite in Production, Rust vs Zig, and WebAssembly',
    snippet: 'The top voted discussions on tech, programming essays, hardware hacking, and minimalist system design.',
    date: '2026-10-30T08:00:00Z',
    category: 'NEWSLETTER',
    importance: 'MEDIUM',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'UX Design Weekly',
    senderEmail: 'hello@uxdesignweekly.com',
    subject: 'Issue #410: Cyberpunk Neomorphism & Accessibility in Games',
    snippet: 'Curated articles on UI design systems, micro-interactions, dark mode color formulas, and typography.',
    date: '2026-10-29T16:45:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Frontend Focus',
    senderEmail: 'frontend@cooperpress.com',
    subject: 'Issue #580: React 19 Best Practices & Vite 6 Benchmarks',
    snippet: 'The latest news in HTML, CSS, JavaScript, Web performance optimizations, and component architecture.',
    date: '2026-10-29T10:15:00Z',
    category: 'NEWSLETTER',
    importance: 'MEDIUM',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'AI Pulse Review',
    senderEmail: 'editor@aipulsereview.com',
    subject: 'The Breakdown: Multimodal Models & On-Device Neural Processing',
    snippet: 'Deep dives into open weights models, prompt engineering patterns, and enterprise AI safety benchmarks.',
    date: '2026-10-28T18:30:00Z',
    category: 'NEWSLETTER',
    importance: 'MEDIUM',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Indie Hackers Digest',
    senderEmail: 'courtland@indiehackers.com',
    subject: 'How this solo founder hit $50k MRR building gamified tools',
    snippet: 'Case study: Product positioning, landing page conversion strategies, and bootstrapping tech startups.',
    date: '2026-10-28T12:00:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'FinTech Pulse',
    senderEmail: 'briefing@fintechpulse.co',
    subject: 'Weekly Briefing: Real-time payments, open banking APIs & Crypto',
    snippet: 'Market developments across cross-border remittances, digital wallets, and regulatory compliance updates.',
    date: '2026-10-27T19:10:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Product Hunt Daily',
    senderEmail: 'hello@producthunt.com',
    subject: 'Top 10 Products Launched Today: Retro Arcade DevTools & More',
    snippet: 'Check out today’s most upvoted community launches including developer productivity apps and games.',
    date: '2026-10-27T14:40:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Data Engineering Weekly',
    senderEmail: 'info@dataengineeringweekly.com',
    subject: 'Issue #185: Stream processing with Apache Kafka & DuckDB',
    snippet: 'Articles on real-time data pipelines, data lakehouse architectures, and modern ETL workflows.',
    date: '2026-10-26T11:20:00Z',
    category: 'NEWSLETTER',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },

  // IMPORTANT / VIP (10)
  {
    sender: 'Project Lead Alex',
    senderEmail: 'alex@outlier-hackathon.org',
    subject: 'PromptWars Hackathon: Final Presentation Guidelines & Review',
    snippet: 'Please verify all repository guidelines before final presentation. Ensure your live demo handles auth gracefully.',
    date: '2026-10-31T10:00:00Z',
    category: 'IMPORTANT',
    importance: 'CRITICAL',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'Google Cloud Billing',
    senderEmail: 'no-reply-billing@google.com',
    subject: 'Monthly Invoice Available for Google Workspace & API Usage',
    snippet: 'Your statement for the billing cycle ending October 2026 is now ready to download from Google Cloud Console.',
    date: '2026-10-31T05:30:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'GitHub Security',
    senderEmail: 'noreply@github.com',
    subject: '[Security Advisory] Two-Factor Authentication Backup Keys',
    snippet: 'You recently updated your security settings. Please store your recovery codes in a safe place.',
    date: '2026-10-30T18:00:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'HR Department',
    senderEmail: 'people@company-global.com',
    subject: 'Action Required: Annual Open Enrollment Period Closes Soon',
    snippet: 'Please review your health benefit elections and retirement contributions before the deadline this Friday.',
    date: '2026-10-30T13:45:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'Bank Operations',
    senderEmail: 'statements@firstnationalbank.com',
    subject: 'Your Official Monthly Checking Account Statement is Ready',
    snippet: 'Log in securely to internet banking to review your transaction history and account balance summary.',
    date: '2026-10-29T23:10:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'DevOps On-Call',
    senderEmail: 'alerts@pagerduty-system.com',
    subject: 'Resolved: Database Secondary Node Latency Spike Alert',
    snippet: 'Incidents #8841 and #8842 have been marked resolved. Post-mortem investigation documentation is attached.',
    date: '2026-10-29T15:20:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'Doctor Office Portal',
    senderEmail: 'appointments@healthsystem.org',
    subject: 'Appointment Confirmation: Routine Checkup on Nov 5th',
    snippet: 'Your upcoming consultation with Dr. Miller is scheduled for 10:30 AM. Reply C to confirm or R to reschedule.',
    date: '2026-10-28T16:00:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'Tax Advisor Services',
    senderEmail: 'cpa@taxadvisors.com',
    subject: 'Quarterly Estimated Tax Payment Schedule & Reminders',
    snippet: 'Attached is the summary breakdown for your Q4 tax liabilities. Please review and execute before the due date.',
    date: '2026-10-28T09:30:00Z',
    category: 'IMPORTANT',
    importance: 'CRITICAL',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'University Alumni Admin',
    senderEmail: 'registrar@stateuniversity.edu',
    subject: 'Official Transcript Request Confirmation #TR-9921',
    snippet: 'Your electronic transcript has been securely sent to the requesting institution.',
    date: '2026-10-27T20:15:00Z',
    category: 'IMPORTANT',
    importance: 'MEDIUM',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },
  {
    sender: 'Property Management',
    senderEmail: 'tenants@cityapartments.com',
    subject: 'Notice: Scheduled Building Water Main Maintenance on Tuesday',
    snippet: 'Water supply will be temporarily shut off between 9:00 AM and 12:00 PM for routine plumbing inspection.',
    date: '2026-10-27T11:00:00Z',
    category: 'IMPORTANT',
    importance: 'HIGH',
    enemyType: 'Cruiser',
    hp: 4,
    maxHp: 4,
    points: 400
  },

  // OLD UNREAD (10)
  {
    sender: 'Social Network Team',
    senderEmail: 'no-reply@socialconnect.net',
    subject: 'You haven’t logged in recently: 45 friends posted updates',
    snippet: 'Catch up on recent photos, comments, and event invitations from your extended social network.',
    date: '2025-04-12T10:00:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Travel Reviewer Club',
    senderEmail: 'reviews@explore-places.com',
    subject: 'How was your stay in Seattle? Share a 2-minute review',
    snippet: 'Help fellow travelers by sharing your thoughts on your recent hotel stay and earn loyalty points.',
    date: '2025-01-20T14:30:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'E-Reader Bookstore',
    senderEmail: 'promos@ereaderbooks.com',
    subject: 'Unread Sample: Chapter 1 of top sci-fi bestseller',
    snippet: 'Download the free preview excerpt of the award-winning space opera trilogy.',
    date: '2024-11-05T18:10:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Cloud Storage Old Alert',
    senderEmail: 'notifications@cloudvault.io',
    subject: 'Your 15GB free storage is 80% full',
    snippet: 'You have 12.2 GB of photos and documents stored. Upgrade to 100GB plan for $1.99/mo.',
    date: '2024-08-19T09:45:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Gaming Community',
    senderEmail: 'news@arcade-gamers.org',
    subject: 'Leaderboard Update: Summer Speedrun Tournament Results',
    snippet: 'Check out the world record times set during the annual retro platformer championship.',
    date: '2024-06-30T21:00:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Music Streaming App',
    senderEmail: 'recap@musicstream.com',
    subject: 'Your 2024 Year in Music Listening Summary',
    snippet: 'Explore your top genres, most played artists, and personalized favorite playlist from last year.',
    date: '2024-12-15T12:00:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Online Webinar Host',
    senderEmail: 'invites@webinar-events.live',
    subject: 'Recording Available: Microservices Architecture Workshop',
    snippet: 'Missed the live broadcast? Watch the full 90-minute video replay and download speaker slides.',
    date: '2024-03-22T16:20:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Survey Monkey Panel',
    senderEmail: 'surveys@research-opinions.com',
    subject: 'Reminder: Technology Usage Questionnaire',
    snippet: 'We noticed you started the survey but didn’t finish. Resume where you left off.',
    date: '2023-10-10T11:15:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Domain Name Registrar',
    senderEmail: 'renewals@domain-registry-direct.net',
    subject: 'Domain Expired: my-old-sideproject-2022.com',
    snippet: 'Your domain name registration expired. Renew now during the redemption grace period.',
    date: '2023-05-04T08:30:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  },
  {
    sender: 'Fitness Tracker App',
    senderEmail: 'weekly@fit-step-tracker.com',
    subject: 'Weekly Step Count Report: March 2023',
    snippet: 'You logged 42,100 total steps this week. Great job staying active!',
    date: '2023-03-28T19:00:00Z',
    category: 'OLD_UNREAD',
    importance: 'LOW',
    enemyType: 'Scout',
    hp: 2,
    maxHp: 2,
    points: 200
  }
];

export class MockEmailService {
  /**
   * Initializes or loads the 50 sample emails from localStorage
   */
  static getEmails(): DemoEmail[] {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.warn('Failed to parse cached demo emails, re-initializing.');
      }
    }
    return this.resetEmails();
  }

  /**
   * Resets the demo inbox back to the 50 original unread emails.
   */
  static resetEmails(): DemoEmail[] {
    const initialEmails: DemoEmail[] = RAW_MOCK_DATA.map((item, index) => ({
      ...item,
      id: `demo_msg_${index + 1}`,
      unread: true,
      isArchived: false
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmails));
    return initialEmails;
  }

  /**
   * Randomly selects N unarchived emails for a game raid session.
   */
  static getRandomRaidEmails(count: number = 8): DemoEmail[] {
    const all = this.getEmails().filter(e => !e.isArchived);
    if (all.length === 0) {
      // If all are archived, reset for gameplay continuity
      return this.resetEmails().slice(0, count);
    }
    // Shuffle array
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Archives emails in local demo storage (removes from unread pool)
   */
  static archiveEmails(ids: string[]): DemoEmail[] {
    const all = this.getEmails();
    const updated = all.map(email => {
      if (ids.includes(email.id)) {
        return { ...email, isArchived: true, unread: false };
      }
      return email;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Get inbox summary statistics
   */
  static getInboxStats() {
    const emails = this.getEmails();
    const unread = emails.filter(e => !e.isArchived && e.unread).length;
    const archived = emails.filter(e => e.isArchived).length;
    const categoriesCount = {
      PROMOTIONAL: emails.filter(e => e.category === 'PROMOTIONAL' && !e.isArchived).length,
      SPAM: emails.filter(e => e.category === 'SPAM' && !e.isArchived).length,
      NEWSLETTER: emails.filter(e => e.category === 'NEWSLETTER' && !e.isArchived).length,
      IMPORTANT: emails.filter(e => e.category === 'IMPORTANT' && !e.isArchived).length,
      OLD_UNREAD: emails.filter(e => e.category === 'OLD_UNREAD' && !e.isArchived).length,
    };

    return { total: emails.length, unread, archived, categoriesCount };
  }
}
