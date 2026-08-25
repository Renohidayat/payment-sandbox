/**
 * Script untuk mengecek status pencairan dana (withdraw)
 */

const { config, validateConfig } = require('../src/config');
const { getWithdrawStatus } = require('../src/services/ronzzpay');

async function main() {
  validateConfig();
  console.log('═══════════════════════════════════════════');
  console.log('  Cek Status Withdraw (PRODUCTION)');
  console.log('═══════════════════════════════════════════\n');

  const args = process.argv.slice(2);
  const reffId = args[0];

  if (!reffId) {
    console.log('❌ Error: Harap masukkan Reff ID withdraw.');
    console.log('Gunakan: node scripts/check-withdraw-status.js <REFF_ID>');
    return;
  }

  console.log(`📡 Mengecek status withdraw untuk Reff ID: ${reffId}...\n`);

  try {
    const result = await getWithdrawStatus(reffId);

    if (result.status && result.data) {
      console.log('✅ Data Withdraw ditemukan:\n');
      console.log(`   Reff ID   : ${result.data.reff_id}`);
      console.log(`   Tujuan    : ${result.data.code.toUpperCase()}`);
      console.log(`   Penerima  : ${result.data.account_name} (${result.data.account_number})`);
      console.log(`   Amount    : Rp ${result.data.amount}`);
      console.log(`   Fee       : Rp ${result.data.fee}`);
      console.log(`   Total     : Rp ${result.data.total}`);
      console.log(`   Status    : ${result.data.status}`);
      console.log(`   Tanggal   : ${result.data.created_at}`);
    } else {
      console.log('❌ Gagal mengecek status:');
      console.log(`   Pesan: ${result.message}`);
    }
  } catch (error) {
    console.error('\n❌ Gagal mengecek status withdraw:');
    if (error.response) {
      console.error(`   Error: ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

main();
