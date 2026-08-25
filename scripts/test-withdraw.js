/**
 * Script untuk mengecek fitur pencairan dana (withdraw)
 */

const { config, validateConfig } = require('../src/config');
const { createWithdraw } = require('../src/services/ronzzpay');

async function main() {
  validateConfig();
  console.log('◇ injected env (3) from .env // tip: ⌘ custom configs { config: \'./config.json\' }');
  console.log('═══════════════════════════════════════════');
  console.log('  ⚠️ CREATE WITHDRAW (PRODUCTION) ⚠️');
  console.log('═══════════════════════════════════════════\n');

  console.log(`✅ API Key loaded: ${config.apiKey.substring(0, 4)}****${config.apiKey.substring(config.apiKey.length - 4)}`);
  
  // ========== KONFIGURASI WITHDRAW ==========
  // Silakan ubah data di bawah ini dengan tujuan withdraw Anda!
  const amount = 1; // Nominal yang dicairkan (Rp 1)
  const method = 'ewallet'; // ewallet atau bank
  const code = 'dana'; // kode (bca, bni, dana, gopay, dll)
  const accountNumber = '082124152122'; // Nomor rekening / HP ewallet
  const accountName = 'M. Reno Hidayat'; // Nama pemilik
  // ==========================================

  console.log(`📡 Mengirim request pencairan dana (Rp ${amount}) ke ${code.toUpperCase()} (${accountNumber})...\n`);

  try {
    const result = await createWithdraw(amount, method, code, accountNumber, accountName);

    if (result.status && result.data) {
      console.log('✅ Pencairan dana (Withdraw) berhasil diajukan!\n');
      console.log('📋 Detail:');
      console.log(`   Reff ID  : ${result.data.reff_id}`);
      console.log(`   Amount   : Rp ${result.data.amount}`);
      console.log(`   Fee      : Rp ${result.data.fee}`);
      console.log(`   Total    : Rp ${result.data.total}`);
      console.log(`   Status   : ${result.data.status}`);
      console.log(`   Tujuan   : ${result.data.code.toUpperCase()} - ${accountNumber}`);
      console.log(`\nSilakan cek status pencairan ini secara berkala.`);
    } else {
      console.log('\n❌ Gagal membuat request withdraw:');
      console.log(`   Pesan: ${result.message}`);
    }
  } catch (error) {
    console.error('\n❌ Gagal membuat request withdraw:');
    if (error.response) {
      console.error(`   Error: ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

main();
