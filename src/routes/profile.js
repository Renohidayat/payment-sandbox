/**
 * Route: Profile
 * Cek koneksi ke RonzzPay dan ambil informasi akun.
 */

const express = require('express');
const router = express.Router();
const { getProfile } = require('../services/ronzzpay');

/**
 * GET /api/profile
 * Panggil RonzzPay /api/profile dan return hasilnya.
 */
router.get('/', async (req, res) => {
  try {
    const result = await getProfile();
    res.json({
      success: true,
      message: 'Koneksi ke RonzzPay berhasil.',
      data: result,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    res.status(status).json({
      success: false,
      message: `Gagal mengambil profil: ${message}`,
    });
  }
});

module.exports = router;
