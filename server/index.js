/**
 * Hsociety OffSec - Express.js API Server
 * Entry: server/index.js
 *
 * Start: npm run dev (development) | npm start (production)
 * API base: http://localhost:3000/api/v1
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import mongoose from 'mongoose';
import { connectDB } from './db/index.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import pentestRoutes from './routes/pentest.routes.js';
import auditsRoutes from './routes/audits.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import communityRoutes from './routes/community.routes.js';
import studentRoutes from './routes/student.routes.js';
import profileRoutes from './routes/profile.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';  // Frontend expects /api (see VITE_API_BASE_URL)

// ============================================
// Middleware
// ============================================

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================

app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    mongodb: dbOk ? 'connected' : ['disconnected', 'connecting', 'disconnecting', 'connected'][dbState] || 'unknown',
  });
});

// ============================================
// API Routes
// ============================================

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/pentest`, pentestRoutes);
app.use(`${API_PREFIX}/audits`, auditsRoutes);
app.use(`${API_PREFIX}/feedback`, feedbackRoutes);
app.use(`${API_PREFIX}/community`, communityRoutes);
app.use(`${API_PREFIX}/student`, studentRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

// ============================================
// 404 Handler
// ============================================

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', path: _req.path });
});

// ============================================
// Error Handler
// ============================================

app.use((err, _req, res, _next) => {
  console.error('[SERVER] Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============================================
// Start Server (after MongoDB connection)
// ============================================

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[HSOCIETY] API server running at http://localhost:${PORT}${API_PREFIX}`);
    });
  } catch (err) {
    console.error('[HSOCIETY] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
