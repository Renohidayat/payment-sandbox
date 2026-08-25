/**
 * Konfigurasi aplikasi — load & validasi environment variables.
 * API Key WAJIB dari .env, tidak boleh hardcode.
 */

require('dotenv').config();

const config = {
  // RonzzPay API Key (wajib)
  apiKey: process.env.RONZZPAY_API_KEY,

  // Server port
  port: parseInt(process.env.PORT, 10) || 3000,

  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',

  // RonzzPay Base URLs
  ronzzpay: {
    baseUrl: 'https://pg.ronzzyt.id',
    // Endpoint production (read-only, aman)
    profileUrl: 'https://pg.ronzzyt.id/api/profile',
    transactionListUrl: 'https://pg.ronzzyt.id/api/transaction/list',
    // Endpoint SANDBOX (wajib untuk create & status transaction)
    sandboxCreateUrl: 'https://pg.ronzzyt.id/sandbox/transaction/create',
    sandboxStatusUrl: 'https://pg.ronzzyt.id/sandbox/transaction/status',
  },
};

/**
 * Validasi bahwa API Key tersedia.
 * Dipanggil saat startup — gagal lebih awal kalau belum diset.
 */
function validateConfig() {
  if (!config.apiKey || config.apiKey.trim() === '') {
    console.error('❌ RONZZPAY_API_KEY belum diset!');
    console.error('   Salin .env.example ke .env dan isi API Key dari dashboard RonzzPay.');
    process.exit(1);
  }

  // Pastikan API Key tidak bocor ke log
  const masked = config.apiKey.slice(0, 4) + '****' + config.apiKey.slice(-4);
  console.log(`✅ API Key loaded: ${masked}`);
}

module.exports = { config, validateConfig };
