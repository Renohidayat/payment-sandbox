/**
 * Route: Transaction
 * Membuat transaksi (sandbox) dan cek status.
 */

const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { createTransaction, getTransactionStatus } = require('../services/ronzzpay');
const store = require('../store/transactions');

/**
 * POST /transaction/create
 * Membuat transaksi sandbox baru (QRIS / E-Wallet).
 */
router.post('/create', async (req, res) => {
  try {
    const { code, amount, description, webhook_url } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "code" dan "amount" wajib diisi.',
      });
    }

    // Panggil service RonzzPay
    const result = await createTransaction(code, amount, description, webhook_url);

    if (result.status && result.data) {
      // Simpan ke in-memory store
      store.save(result.data.reff_id, result.data);

      // Jika menggunakan QRIS, kita bisa merender QR-nya sendiri
      // menggunakan qr_string (selain qr_image yang diberikan RonzzPay)
      if (result.data.qr_string) {
        try {
          result.data.qr_base64 = await QRCode.toDataURL(result.data.qr_string);
        } catch (qrError) {
          console.error('Gagal generate QR base64:', qrError);
        }
      }
      
      res.json({
        success: true,
        message: 'Transaksi berhasil dibuat',
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Gagal membuat transaksi',
      });
    }
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({
      success: false,
      message: `Error server: ${message}`,
    });
  }
});

module.exports = router;
