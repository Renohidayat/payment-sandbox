/**
 * Script untuk membuat transaksi REAL (Production).
 * PERINGATAN: INI MENGGUNAKAN SALDO ASLI / UANG ASLI!
 */

const axios = require('axios');
const qrcode = require('qrcode');
const { config, validateConfig } = require('../src/config');

async function createRealTransaction(code, amount, description) {
  try {
    const payload = {
      api_key: config.apiKey,
      code,
      amount,
      description
    };

    // Endpoint REAL/PRODUCTION (Bukan sandbox)
    const url = 'https://pg.ronzzyt.id/api/transaction/create';

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  ⚠️ CREATE REAL TRANSACTION (PRODUCTION) ⚠️');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  // Parameter tes produksi (DANA / QRIS, 2 perak)
  const code = 'qris';
  const amount = 2;
  const description = 'Testing Production Rp 2';

  try {
    console.log(`📡 Mengirim request create REAL transaction (Rp ${amount})...\n`);
    
    const result = await createRealTransaction(code, amount, description);

    if (result.status) {
      console.log('✅ Transaksi REAL berhasil dibuat!\n');
      console.log('📋 Detail:');
      console.log(`   Reff ID  : ${result.data.reff_id}`);
      console.log(`   Amount   : Rp ${result.data.amount.toLocaleString('id-ID')}`);
      console.log(`   Fee      : Rp ${result.data.fee.toLocaleString('id-ID')}`);
      console.log(`   Get      : Rp ${result.data.get_amount.toLocaleString('id-ID')}`);
      console.log(`   Status   : ${result.data.status}`);
      console.log(`   Expired  : ${result.data.expired_at}`);
      console.log(`\n🔗 QR Image URL: ${result.data.qr_image || result.data.qr_string}\n`);

      if (result.data.qr_string) {
        console.log('📱 Scan QR Code ini dengan DANA/M-Banking (UANG ASLI):');
        qrcode.toString(result.data.qr_string, { type: 'terminal', small: true }, function (err, url) {
          if (!err) console.log(url);
        });
        console.log('\n⚠️ PERINGATAN: Pembayaran ini akan memotong saldo asli Anda.');
      } else if (result.data.instructions) {
        console.log('\nℹ️ Instruksi Pembayaran:');
        console.log(result.data.instructions);
      }

    } else {
      console.log('❌ Response tidak sukses:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Gagal membuat transaksi REAL:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

main();
