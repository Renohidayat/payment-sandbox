/**
 * Entry point — Express server untuk RonzzPay Sandbox integration.
 */

const express = require('express');
const { config, validateConfig } = require('./config');

// Validasi API Key sebelum apapun
validateConfig();

const app = express();

const webhookRouter = require('./routes/webhook');

// ─── Middleware Global ───────────────────────────────────────────
// Webhook route dipasang SEBELUM express.json() agar bisa mendapatkan raw Buffer
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// JSON body parser untuk semua route KECUALI webhook
app.use(express.json());

// Request logger sederhana
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── Routes ──────────────────────────────────────────────────────
const profileRouter = require('./routes/profile');
const transactionRouter = require('./routes/transaction');

app.use('/api/profile', profileRouter);
app.use('/transaction', transactionRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'RonzzPay Sandbox Integration',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      profile: 'GET /api/profile',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

// ─── Start Server ────────────────────────────────────────────────
const { startPolling } = require('./services/polling');

app.listen(config.port, () => {
  console.log(`\n🚀 Server berjalan di http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Mode: SANDBOX (tidak ada transaksi real)\n`);
  
  // Mulai auto-polling transaksi pending
  startPolling();
});

module.exports = app;
