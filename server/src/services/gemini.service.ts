import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { EnemyCategory } from '../types/index.js';

export interface AIAnalysisResult {
  category: EnemyCategory;
  enemyType: 'Drone' | 'Scout' | 'Alien' | 'Cruiser' | 'Boss';
  hp: number;
  points: number;
  weakness: string;
  summary: string;
}

export class GeminiService {
  private static ai = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

  /**
   * Analyzes an email subject & snippet to determine game enemy attributes.
   * If Gemini key is missing or fails, gracefully falls back to deterministic heuristic rules.
   */
  static async analyzeEmail(subject: string, snippet: string, sender: string): Promise<AIAnalysisResult> {
    if (!this.ai) {
      return this.heuristicFallback(subject, snippet, sender);
    }

    try {
      const prompt = `Analyze this email for a retro arcade game called INBOX RAID.
Sender: ${sender}
Subject: ${subject}
Snippet: ${snippet}

Return JSON with:
- "category": one of ["PROMOTIONAL", "SOCIAL", "SPAM", "IMPORTANT", "NEWSLETTER"]
- "enemyType": one of ["Drone", "Scout", "Alien", "Cruiser", "Boss"]
- "hp": integer between 1 and 10
- "points": integer between 100 and 1000
- "weakness": 1 to 2 word arcade vulnerability (e.g. "Unsubscribe", "Laser", "Blast")
- "summary": 1 short punchy retro action line (max 10 words)`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          category: parsed.category || 'PROMOTIONAL',
          enemyType: parsed.enemyType || 'Drone',
          hp: Math.min(Math.max(parsed.hp || 1, 1), 10),
          points: parsed.points || 100,
          weakness: parsed.weakness || 'Archive Shot',
          summary: parsed.summary || 'Target acquired'
        };
      }
    } catch (error) {
      console.warn('Gemini API analysis warning, using heuristic fallback:', error);
    }

    return this.heuristicFallback(subject, snippet, sender);
  }

  private static heuristicFallback(subject: string, snippet: string, sender: string): AIAnalysisResult {
    const combined = `${subject} ${snippet} ${sender}`.toLowerCase();

    if (combined.includes('sale') || combined.includes('discount') || combined.includes('% off')) {
      return { category: 'PROMOTIONAL', enemyType: 'Drone', hp: 1, points: 100, weakness: 'Unsubscribe', summary: 'Marketing promo drone' };
    }
    if (combined.includes('newsletter') || combined.includes('issue #') || combined.includes('digest')) {
      return { category: 'NEWSLETTER', enemyType: 'Boss', hp: 8, points: 1000, weakness: 'Read Later', summary: 'Massive content newsletter boss' };
    }
    if (combined.includes('urgent') || combined.includes('hackathon') || combined.includes('important')) {
      return { category: 'IMPORTANT', enemyType: 'Cruiser', hp: 5, points: 600, weakness: 'Priority Strike', summary: 'High priority tactical email' };
    }
    if (combined.includes('claim') || combined.includes('crypto') || combined.includes('usdt')) {
      return { category: 'SPAM', enemyType: 'Alien', hp: 3, points: 400, weakness: 'Spam Blast', summary: 'Alien spam parasite' };
    }

    return { category: 'SOCIAL', enemyType: 'Scout', hp: 2, points: 200, weakness: 'Quick Archive', summary: 'Social scout ship' };
  }
}
