/**
 * Verifikasi HMAC-SHA256 signature dari webhook RonzzPay.
 * 
 * RonzzPay mengirim header X-Signature berisi:
 *   HMAC-SHA256(raw_json_body, api_key)
 * 
 * Kita harus memverifikasi ini sebelum memproses payload.
 */

const crypto = require('crypto');

/**
 * Verifikasi webhook signature menggunakan timing-safe comparison.
 * 
 * @param {string|Buffer} rawBody - Raw JSON body (BUKAN parsed object)
 * @param {string} signatureHeader - Nilai header X-Signature
 * @param {string} apiKey - API Key untuk HMAC
 * @returns {boolean} true jika signature valid
 */
function verifySignature(rawBody, signatureHeader, apiKey) {
  if (!signatureHeader || !rawBody || !apiKey) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', apiKey)
    .update(rawBody)
    .digest('hex');

  // Timing-safe comparison untuk mencegah timing attack
  try {
    const sigBuffer = Buffer.from(signatureHeader, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

module.exports = { verifySignature };
