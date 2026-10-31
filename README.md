# ⚡ INBOX RAID

> **Turn your overflowing email inbox into a high-octane Cyberpunk 80s arcade raid battle.**  
> Built with React, TypeScript, Tailwind CSS, Express, and official **Google OAuth 2.0 & Gmail API**.

---

## 🎮 What is INBOX RAID?

**INBOX RAID** gamifies email triage by transforming unread emails into enemy starships, drones, alien vessels, and corrupted boss overlords. Every time you triage an email:
- **Archive (Swipe Left / `←`)**: Vaporizes the enemy drone and removes the `INBOX` label in Gmail.
- **Keep / Spare (Swipe Right / `→`)**: Leaves the email untouched in your inbox.
- **Protected VIPs**: Flags important personal or urgent emails to protect you from accidentally archiving them.
- **Unread Overlord Boss Battle**: Face down the cumulative procrastination of thousands of unread emails in an epic boss battle.

---

## 🔒 Zero Deletion Safety Guarantee

Your emails are safe:
- **No Deletions Ever**: INBOX RAID never calls `messages.delete` or `messages.trash`.
- **Archive Only**: Archiving only removes the `INBOX` label from the email.
- **Quick Undo**: Press `Ctrl+Z` anytime to restore the archived message back to your inbox.
- **Demo Mode**: Play with 50 pre-seeded mock enemies without connecting a real Gmail account.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Official Google APIs SDK (`googleapis`)
- **Authentication**: Google OAuth 2.0 with CSRF state protection & session cookies
- **Scopes**: `https://www.googleapis.com/auth/gmail.modify` (archiving and unarchiving only)

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- [Git](https://git-scm.com/)
- A Google Cloud Project with the **Gmail API** enabled

---

### 2. Google Cloud Setup (OAuth 2.0)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Gmail API** under **APIs & Services > Library**.
3. Configure the **OAuth Consent Screen** (External or Testing) and add your email as a test user.
4. Add the scope: `https://www.googleapis.com/auth/gmail.modify`.
5. Create **OAuth 2.0 Client ID Credentials** (Web Application):
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`
6. Copy your **Client ID** and **Client Secret**.

---

### 3. Installation & Environment Configuration

#### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/inbox-raid.git
cd inbox-raid
```

#### Server Configuration
```bash
cd server
npm install
```

Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_super_secret_session_key_replace_in_production

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

Build and run the server:
```bash
npm run build
npm start
```

#### Client Configuration
In another terminal:
```bash
cd client
npm install
npm run dev
```

The game will now be live at **`http://localhost:5173`**.

---

## 🕹️ Controls

| Action | Control | Description |
|---|---|---|
| **Archive (Defeat Enemy)** | Swipe Left / Left Arrow (`←`) | Removes `INBOX` label from Gmail |
| **Keep / Spare** | Swipe Right / Right Arrow (`→`) | Spares email; no changes made |
| **Undo Last Archive** | `Ctrl+Z` / `Cmd+Z` | Restores last archived email to inbox |
| **Boss Attack** | Left Arrow (`←`) | Inflicts -1 HP on Unread Overlord |

---

## 📜 License
MIT License. Built for PromptWars Hackathon 2026.

