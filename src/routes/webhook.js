/**
 * Route: Webhook
 * Menerima notifikasi perubahan status transaksi dari RonzzPay.
 */

const express = require('express');
const router = express.Router();
const verifyWebhook = require('../middleware/verifyWebhook');
const store = require('../store/transactions');

/**
 * POST /webhook
 * 
 * Middleware express.raw({ type: 'application/json' }) wajib dipasang 
 * di level route (atau sebelum router ini di index.js) agar body tidak 
 * ter-parse menjadi JSON object secara prematur.
 */
router.post('/', verifyWebhook, (req, res) => {
  const payload = req.parsedBody;
  
  console.log(`\n🔔 Webhook Event Received: ${payload.event}`);

  if (payload.event === 'transaction.success' || payload.event === 'transaction.failed' || payload.event === 'transaction.expired') {
    const { reff_id, status } = payload.data;
    
    // Update store
    store.updateStatus(reff_id, status);
    
    console.log(`✅ Webhook processed. Transaction ${reff_id} status updated to ${status}.`);
  } else {
    console.log(`ℹ️ Webhook event '${payload.event}' ignored.`);
  }

  // Wajib response 200 OK agar server RonzzPay tahu webhook berhasil diterima
  res.status(200).json({ success: true, message: 'Webhook received' });
});

module.exports = router;
