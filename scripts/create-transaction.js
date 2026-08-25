/**
 * Quick-test: Buat transaksi sandbox (QRIS) dan print QR ke terminal.
 * 
 * Usage: node scripts/create-transaction.js
 */

const { config, validateConfig } = require('../src/config');
const { createTransaction } = require('../src/services/ronzzpay');
const QRCode = require('qrcode');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Create Sandbox Transaction (QRIS)');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  try {
    const amount = 50000;
    const code = 'qris';
    const description = 'Testing Sandbox QRIS';

    console.log(`📡 Mengirim request create transaction (Rp ${amount})...\n`);
    
    // Webhook di-skip dulu karena belum setup tunnel, 
    // tapi nanti bisa diisi url tunnel.
    const result = await createTransaction(code, amount, description);

    if (result.status) {
      console.log('✅ Transaksi berhasil dibuat!\n');
      console.log('📋 Detail:');
      console.log(`   Reff ID  : ${result.data.reff_id}`);
      console.log(`   Amount   : Rp ${result.data.amount.toLocaleString('id-ID')}`);
      console.log(`   Fee      : Rp ${result.data.fee.toLocaleString('id-ID')}`);
      console.log(`   Get      : Rp ${result.data.get_amount.toLocaleString('id-ID')}`);
      console.log(`   Status   : ${result.data.status}`);
      console.log(`   Expired  : ${result.data.expired_at}`);
      console.log(`\n🔗 QR Image URL: ${result.data.qr_image}\n`);

      if (result.data.qr_string) {
        console.log('📱 Scan QR Code ini (Sandbox):');
        // Print QR ke terminal
        QRCode.toString(result.data.qr_string, { type: 'terminal', small: true }, function (err, url) {
          if (!err) console.log(url);
          console.log('\n═══════════════════════════════════════════\n');
        });
      }
    } else {
      console.log('❌ Response tidak sukses:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Gagal membuat transaksi:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
