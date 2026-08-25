/**
 * Service wrapper untuk semua panggilan API RonzzPay.
 * Menggunakan axios dengan base configuration.
 * 
 * PENTING: Untuk transaction create & status, WAJIB pakai endpoint sandbox.
 */

const axios = require('axios');
const { config } = require('../config');

// Axios instance dengan defaults
const apiClient = axios.create({
  timeout: 30000, // 30 detik
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — log outgoing requests (tanpa API key)
apiClient.interceptors.request.use((req) => {
  console.log(`→ ${req.method.toUpperCase()} ${req.url}`);
  return req;
});

// Response interceptor — log status
apiClient.interceptors.response.use(
  (res) => {
    console.log(`← ${res.status} ${res.config.url}`);
    return res;
  },
  (err) => {
    if (err.response) {
      console.error(`← ${err.response.status} ${err.config.url}`);
      console.error('  Response:', JSON.stringify(err.response.data));
    } else {
      console.error(`← ERROR ${err.message}`);
    }
    return Promise.reject(err);
  }
);

/**
 * Cek koneksi & ambil profil akun.
 * Endpoint: POST /api/profile (production, read-only — aman)
 */
async function getProfile() {
  const response = await apiClient.post(config.ronzzpay.profileUrl, {
    api_key: config.apiKey,
  });
  return response.data;
}

/**
 * Buat transaksi sandbox (QRIS/e-wallet).
 * Endpoint: POST /sandbox/transaction/create
 * 
 * @param {string} code - Kode pembayaran: 'qris', 'dana', 'ovo', 'gopay', dll
 * @param {number} amount - Jumlah pembayaran (Rp)
 * @param {string} [description] - Catatan/deskripsi pesanan
 * @param {string} [webhookUrl] - URL webhook untuk notifikasi
 */
async function createTransaction(code, amount, description, webhookUrl) {
  const payload = {
    api_key: config.apiKey,
    code,
    amount,
  };

  if (description) payload.description = description;
  if (webhookUrl) payload.webhook_url = webhookUrl;

  const response = await apiClient.post(config.ronzzpay.sandboxCreateUrl, payload);
  return response.data;
}

/**
 * Cek status transaksi sandbox.
 * Endpoint: POST /sandbox/transaction/status
 * 
 * @param {string} reffId - Reference ID dari create transaction
 */
async function getTransactionStatus(reffId) {
  const response = await apiClient.post(config.ronzzpay.sandboxStatusUrl, {
    api_key: config.apiKey,
    reff_id: reffId,
  });
  return response.data;
}

/**
 * List transaksi (production endpoint, read-only).
 * Endpoint: POST /api/transaction/list
 * 
 * @param {object} [options]
 * @param {string} [options.status] - Filter: 'success', 'failed', 'pending'
 * @param {number} [options.page] - Halaman (default: 1)
 * @param {number} [options.perPage] - Item per halaman (default: 15, max: 100)
 */
async function listTransactions(options = {}) {
  const payload = {
    api_key: config.apiKey,
  };

  if (options.status) payload.status = options.status;
  if (options.page) payload.page = options.page;
  if (options.perPage) payload.per_page = options.perPage;

  const response = await apiClient.post(config.ronzzpay.transactionListUrl, payload);
  return response.data;
}

module.exports = {
  getProfile,
  createTransaction,
  getTransactionStatus,
  listTransactions,
};
