/**
 * Route: Withdraw
 * Penarikan dana ke rekening Bank / E-Wallet.
 */

const express = require('express');
const router = express.Router();
const { createWithdraw, getWithdrawStatus } = require('../services/ronzzpay');

/**
 * POST /withdraw/create
 */
router.post('/create', async (req, res) => {
  try {
    const { amount, method, code, account_number, account_name } = req.body;

    if (!amount || !method || !code || !account_number || !account_name) {
      return res.status(400).json({
        success: false,
        message: 'Parameter amount, method, code, account_number, account_name wajib diisi.',
      });
    }

    const result = await createWithdraw(amount, method, code, account_number, account_name);

    if (result.status && result.data) {
      res.json({
        success: true,
        message: 'Pencairan berhasil diajukan',
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message || 'Gagal mengajukan pencairan',
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

/**
 * GET /withdraw/status/:reffId
 */
router.get('/status/:reffId', async (req, res) => {
  try {
    const { reffId } = req.params;
    const result = await getWithdrawStatus(reffId);

    if (result.status && result.data) {
      res.json({
        success: true,
        message: 'Detail status pencairan',
        data: result.data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message || 'Pencairan tidak ditemukan',
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
