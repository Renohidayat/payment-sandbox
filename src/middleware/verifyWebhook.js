/**
 * Middleware untuk memverifikasi HMAC-SHA256 signature dari webhook RonzzPay.
 */

const { verifySignature } = require('../services/signature');
const { config } = require('../config');

function verifyWebhook(req, res, next) {
  // Ambil signature dari header
  const signature = req.headers['x-signature'] || req.headers['X-Signature'];
  
  if (!signature) {
    console.error('❌ Webhook error: X-Signature header missing');
    return res.status(401).json({ success: false, message: 'Missing signature' });
  }

  // Gunakan req.body sebagai raw Buffer.
  // Ini mensyaratkan route webhook di-parse menggunakan express.raw()
  const rawBody = req.body;

  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    console.error('❌ Webhook error: Body is not a Buffer. Pastikan menggunakan express.raw()');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }

  const isValid = verifySignature(rawBody, signature, config.apiKey);

  if (!isValid) {
    console.error('❌ Webhook error: Invalid signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  // Signature valid, parse JSON untuk digunakan di handler berikutnya
  try {
    req.parsedBody = JSON.parse(rawBody.toString('utf8'));
    next();
  } catch (error) {
    console.error('❌ Webhook error: Invalid JSON body');
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
}

module.exports = verifyWebhook;
