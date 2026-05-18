const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// trust proxy for rate limiting on Vercel
app.set('trust proxy', 1);


// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999// limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Routes
const postsRouter = require('./backend/routes/posts');
const commentsRouter = require('./backend/routes/comments');
const reactionsRouter = require('./backend/routes/reactions');
const searchRouter = require('./backend/routes/search');
const feedsRouter = require('./backend/routes/feeds');

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/reactions', reactionsRouter);
app.use('/api/search', searchRouter);
app.use('/api/feeds', feedsRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Cron endpoint for Supabase/Vercel Crons
const { runSync } = require('./backend/jobs/feedSync');
app.get('/api/cron/sync', async (req, res) => {
  // Simple protection check (optional but recommended)
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await runSync();
    res.status(200).json({ message: 'Sync completed' });
  } catch (err) {
    console.error('Cron job failed:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Export the app for Vercel
module.exports = app;

// Serve static files when not in a production (Vercel) environment
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Serve index.html for all non-API routes (SPA fallback)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

