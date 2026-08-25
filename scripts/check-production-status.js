/**
 * Script untuk mengecek status transaksi REAL (Production).
 */

const axios = require('axios');
const { config, validateConfig } = require('../src/config');

async function getRealTransactionStatus(reffId) {
  const payload = {
    api_key: config.apiKey,
    reff_id: reffId,
  };
  const url = 'https://pg.ronzzyt.id/api/transaction/status';
  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Cek Status REAL Transaction (Production)');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  const reffId = process.argv[2];
  if (!reffId) {
    console.error('❌ Error: Reff ID wajib diisi.');
    console.error('   Usage: node scripts/check-production-status.js <reff_id>');
    process.exit(1);
  }

  try {
    console.log(`📡 Mengecek status REAL untuk reff_id: ${reffId}...\n`);
    
    const result = await getRealTransactionStatus(reffId);

    if (result.status && result.data) {
      console.log('✅ Detail Transaksi:\n');
      console.log(`   Reff ID  : ${result.data.reff_id}`);
      console.log(`   Amount   : Rp ${result.data.amount.toLocaleString('id-ID')}`);
      console.log(`   Status   : ${result.data.status}`);
      console.log(`   Method   : ${result.data.method}`);
      console.log(`   Update   : ${result.data.updated_at || result.data.created_at}`);
      
      if (result.data.status === 'success') {
        console.log('\n🎉 Transaksi ini sudah berhasil dibayar (UANG ASLI)!');
      } else if (result.data.status === 'pending') {
        console.log('\n⏳ Transaksi ini masih menunggu pembayaran.');
      }
    } else {
      console.log('❌ Response tidak sukses:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Gagal mengecek transaksi:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

main();
