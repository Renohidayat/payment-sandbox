/**
 * Quick-test: Cek status transaksi sandbox dari RonzzPay API.
 * 
 * Usage: node scripts/check-status.js <reff_id>
 */

const { config, validateConfig } = require('../src/config');
const { getTransactionStatus } = require('../src/services/ronzzpay');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Cek Status Transaksi Sandbox');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  const reffId = process.argv[2];
  if (!reffId) {
    console.error('❌ Error: Reff ID wajib diisi.');
    console.error('   Usage: node scripts/check-status.js <reff_id>');
    process.exit(1);
  }

  try {
    console.log(`📡 Mengecek status untuk reff_id: ${reffId}...\n`);
    
    const result = await getTransactionStatus(reffId);

    if (result.status && result.data) {
      console.log('✅ Detail Transaksi:\n');
      console.log(`   Reff ID  : ${result.data.reff_id}`);
      console.log(`   Amount   : Rp ${result.data.amount.toLocaleString('id-ID')}`);
      console.log(`   Status   : ${result.data.status}`);
      console.log(`   Method   : ${result.data.method}`);
      console.log(`   Update   : ${result.data.updated_at || result.data.created_at}`);
      
      if (result.data.status === 'success') {
        console.log('\n🎉 Transaksi ini sudah berhasil dibayar!');
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
    process.exit(1);
  }
}

main();
