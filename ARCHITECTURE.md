# INBOX RAID — Architecture & Technical Specification

> **Tagline:** Don't clean your inbox. Fight your inbox.  
> **Event:** PromptWars × OUTLIER 2026  
> **Author:** Hackathon Product Architecture & Engineering Team  
> **Status:** Step 1 Completed — Initial Scaffold & Blueprint  

---

## 1. Executive Summary & Vision

**INBOX RAID** transforms the tedious chore of email management into an adrenaline-fueled retro arcade game. Millions of professionals suffer from email overwhelm and procrastination. INBOX RAID turns unread emails into incoming space invaders, monsters, or boss battles. When a user shoots, slashes, or unleashes a super ability on an enemy email, the backend performs a real, non-destructive **Archive** action in their Gmail inbox.

### Core Architecture Guarantees
1. **Real Gmail Operations:** Actual email archiving via official Google OAuth 2.0 & Gmail API.
2. **Zero Destructive Deletion:** Emails are strictly **archived** (removing the `INBOX` label). `messages.delete` is disabled by design.
3. **User-Intent Driven:** No background autonomous email deletion or auto-archiving without direct player input/action.
4. **Secure Token Handling:** Refresh tokens and session secrets encrypted with AES-256-GCM server-side; HTTP-only secure cookies for client sessions.
5. **Instant Demo Mode:** Full game functionality playable instantly using rich mock email data without needing Google OAuth credentials.
6. **AI Recommendations:** Gemini AI categorizes emails (Spam, Newsletter, Urgency, Boss Email), drafts action tags, and powers game mechanics—never acting without user trigger.

---

## 2. Technology Stack

### Frontend Architecture
* **Framework:** React 18 / 19 with TypeScript
* **Build Tool:** Vite (Ultra-fast HMR and bundling)
* **Styling & UI:** Tailwind CSS v4 / v3 with custom arcade retro theme extensions
* **Animations:** Framer Motion (smooth canvas overlay, hit feedback, damage numbers, health bars)
* **Icons:** Lucide React
* **Audio Engine:** Howler.js / Web Audio API (retro arcade sound effects, lasers, explosions, boss alerts)

### Backend Architecture
* **Runtime:** Node.js (v24 LTS)
* **Web Framework:** Express.js with TypeScript
* **Authentication:** Passport.js / `google-auth-library` with Session / JWT hybrid
* **Database / Cache:** SQLite via Better-SQLite3 / Prisma (or light in-memory store with persistence fallback for instant zero-dependency hackathon setup)
* **Encryption:** Node `crypto` (AES-256-GCM) for OAuth token encryption at rest

### Third-Party Integrations
* **Google OAuth 2.0:** User authentication & authorization grant
* **Gmail API (`googleapis`):** Email fetching (`messages.list`, `messages.get`) and non-destructive archiving (`messages.batchModify` / `messages.modify`)
* **Google Gemini AI API (`@google/genai`):** Categorizes inbox items into enemy types (Drone, Tank, Elite, Boss), extracts priority score, synthesizes 1-line email summaries, and generates weakness keywords for game mechanics.

---

## 3. High-Level System Architecture

```
                                +----------------------------------+
                                |          React Frontend          |
                                |  (Vite + Tailwind + Framer Motion|
                                +-----------------+----------------+
                                                  |
                                       REST API / WebSocket
                                                  |
                                                  v
                                +-----------------+----------------+
                                |        Node.js Express Server    |
                                +----+------------+-----------+----+
                                     |            |           |
               +---------------------+            |           +---------------------+
               |                                  |                                 |
               v                                  v                                 v
   +-----------+-----------+          +-----------+-----------+         +-----------+-----------+
   |   Google OAuth 2.0    |          |       Gmail API       |         |   Google Gemini AI    |
   | Authentication & Auth |          | (Fetch & Archive Only)|         |  Classification Engine|
   +-----------------------+          +-----------------------+         +-----------------------+
```

---

## 4. Google OAuth & Gmail Integration Plan

### Required OAuth Scopes
To enforce strict security and minimal necessary permissions, INBOX RAID requests only:
* `openid`, `profile`, `email` (Authentication)
* `https://www.googleapis.com/auth/gmail.modify` (Read, label, and archive emails. Explicitly **does not** allow permanent deletion).

### Auth & Session Workflow
1. User clicks **"Connect Gmail"** (or selects **"Play Demo Mode"**).
2. For real login, frontend redirects to `/api/auth/google`.
3. Backend initiates OAuth 2.0 flow with `access_type: 'offline'` and `prompt: 'consent'` to secure a refresh token.
4. On callback, backend exchanges code for tokens, encrypts the refresh token using AES-256-GCM, stores user record in database, and issues an HTTP-only secure cookie session.
5. In **Demo Mode**, backend returns a synthetic demo session bypass token, loading generated mock email waves.

---

## 5. Database Schema & Data Models

### Database Tables (SQLite / In-Memory JSON store for speed)

#### 1. `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | STRING (UUID) | Primary Key |
| `google_id` | STRING | Google User ID |
| `email` | STRING | User Email Address |
| `display_name` | STRING | User Display Name |
| `avatar_url` | STRING | User Profile Picture |
| `encrypted_refresh_token` | TEXT | AES-256-GCM Encrypted Token |
| `is_demo` | BOOLEAN | Demo Mode Indicator |
| `created_at` | TIMESTAMP | Creation Timestamp |

#### 2. `game_stats`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | STRING (UUID) | Primary Key |
| `user_id` | STRING | Foreign Key -> `users.id` |
| `score` | INTEGER | High score achieved |
| `emails_archived` | INTEGER | Total real emails archived |
| `bosses_defeated` | INTEGER | Count of newsletter/boss emails cleared |
| `highest_combo` | INTEGER | Max hit combo streak |
| `last_played_at` | TIMESTAMP | Last play date |

#### 3. `email_cache` (Transient Metadata)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | STRING | Message ID |
| `user_id` | STRING | User ID |
| `sender` | STRING | Email Sender Name & Address |
| `subject` | STRING | Email Subject Line |
| `snippet` | STRING | Short Preview Text |
| `category` | STRING | AI Category (Spam, Promo, Urgent, Social) |
| `enemy_type` | STRING | Game enemy assignment (Minion, Drone, Boss) |
| `hp` | INTEGER | Health points based on email length/importance |
| `archived` | BOOLEAN | Processed status flag |

---

## 6. AI Categorization & Game Mechanics

### Enemy Classification System (Powered by Gemini AI)
Each email is analyzed by Gemini AI and mapped to a game entity:

| Email Type | Gemini Classification | Game Enemy Class | Enemy HP | Sound & Visual |
| :--- | :--- | :--- | :--- | :--- |
| Promotions / Marketing | `PROMOTIONAL` | **Minion Drone** | 1 HP | Green small ship |
| Social Notifications | `SOCIAL` | **Scout Fighter** | 2 HP | Blue medium ship |
| Cold Outreach / Spam | `SPAM` | **Alien Parasite** | 3 HP | Purple spiky alien |
| High Priority / Work | `IMPORTANT` | **Heavy Cruiser** | 5 HP | Yellow armored ship |
| Long Newsletters / Subscriptions | `NEWSLETTER` | **STATION BOSS** | 10 HP | Red giant boss vessel |

### User Actions & Backend Sync
* **Basic Shot / Laser:** Deals 1 damage to targeted email enemy.
* **Archive Blast (Destroy Enemy):** When HP reaches 0, enemy explodes. Frontend queues message ID to batch sync buffer.
* **Batch Raid Sync:** Frontend calls `/api/emails/archive` with array of message IDs. Backend issues a single `messages.batchModify` to remove `INBOX` label in Gmail.
* **Power-up - "Unsubscribe Missile":** For boss newsletters, user can fire an Unsubscribe Missile (provides quick direct link or label tagging).

---

## 7. Security Blueprint & Rules

1. **No Permanent Deletion:** Code inspection guarantee — the backend service source code strictly calls `batchModify` removing `INBOX`. The `messages.delete` endpoint is nowhere present in codebase.
2. **Token Encryption:** Refresh tokens encrypted with server-side master key (`ENCRYPTION_KEY`). Never exposed to client JS.
3. **Client Session Protection:** Signed HTTP-only, `SameSite=Lax` cookies for session ID.
4. **Prompt Injection Safety:** Email content passed to Gemini AI is truncated and wrapped in strict JSON schema validation.
5. **Rate-Limit Resilience:** Gmail API quota management via request throttling and frontend batching (updates every 2 seconds or on combo finish).

---

## 8. Development Roadmap

* **Step 1 (CURRENT):** Architecture blueprint, tech stack validation, security design, project scaffold creation.
* **Step 2:** Backend core implementation: Express server, OAuth setup, Gmail service layer, Demo mock provider, Gemini AI classifier API.
* **Step 3:** Frontend game engine development: Canvas / Framer Motion arcade view, Email weapon system, hit markers, audio synthesis, HUD & combo meters.
* **Step 4:** Real-time sync engine, high score leaderboard, sound toggle, error handling, final demo validation & launch readiness.
