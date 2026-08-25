/**
 * Quick-test: Simulasi pengiriman webhook dari RonzzPay ke server lokal.
 * Script ini men-generate HMAC-SHA256 valid seperti yang dilakukan RonzzPay.
 * 
 * Usage: node scripts/test-webhook.js <reff_id>
 */

const crypto = require('crypto');
const axios = require('axios');
const { config, validateConfig } = require('../src/config');
const store = require('../src/store/transactions');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Simulasi Webhook RonzzPay');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  const reffId = process.argv[2] || 'TRX-SIMULASI-123';
  const url = `http://localhost:${config.port}/webhook`;

  // Payload contoh
  const payloadObj = {
    event: 'transaction.success',
    data: {
      reff_id: reffId,
      description: 'Testing Sandbox QRIS (Webhook Simulasi)',
      method: 'ewallet',
      code: 'qris',
      type: 'in',
      amount: 50000,
      fee: 476,
      total: 50476,
      status: 'success',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  // 1. Convert payload ke raw JSON string
  const rawJson = JSON.stringify(payloadObj);

  // 2. Generate HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', config.apiKey)
    .update(rawJson)
    .digest('hex');

  console.log(`📡 Target     : POST ${url}`);
  console.log(`🔑 Signature  : ${signature}`);
  console.log(`📦 Payload    : ${rawJson}`);

  try {
    console.log('\n🚀 Mengirim webhook...\n');
    
    const response = await axios.post(url, rawJson, {
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature
      }
    });

    console.log('✅ Response:', response.data);
  } catch (error) {
    console.error('❌ Gagal mengirim webhook:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.error('\n⚠️ Pastikan server sedang berjalan! (npm run dev)');
  }
}

main();
