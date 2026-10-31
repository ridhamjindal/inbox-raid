import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (res && 'writeHead' in res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  success: false,
                  backendOffline: true,
                  notConfigured: true,
                  error: 'BACKEND_OFFLINE',
                  message:
                    'INBOX RAID backend server is not running on http://localhost:5000. Please start the backend server by running "npm run dev" inside the server directory.'
                })
              );
            }
          });
        }
      }
    }
  }
});
