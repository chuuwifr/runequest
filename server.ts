import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};
const __dirname_resolved = getDirname();

async function startServer() {
  const app = express();
  // Support custom PORT from environment if running locally, defaulting to 3000
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = '0.0.0.0';

  app.use(express.json({ limit: '50mb' }));

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'RuneQuesting FR',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Example API route for server-side backup ping / validation if needed
  app.post('/api/backup/validate', (req, res) => {
    try {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ valid: false, message: 'Invalid JSON payload' });
      }
      return res.json({ valid: true, received: true });
    } catch (err: any) {
      return res.status(500).json({ valid: false, error: err?.message || 'Server error' });
    }
  });

  // Vite middleware in development vs static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`=========================================`);
    console.log(`🗡️  RuneQuesting FR - Serveur Local Actif`);
    console.log(`🌐 Accessible sur : http://localhost:${PORT}`);
    console.log(`=========================================`);
  });
}

startServer();
