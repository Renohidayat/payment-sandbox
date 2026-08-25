/**
 * Quick-test: Panggil RonzzPay /api/profile untuk validasi koneksi & API Key.
 * 
 * Usage: node scripts/check-profile.js
 */

const { config, validateConfig } = require('../src/config');
const { getProfile } = require('../src/services/ronzzpay');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  RonzzPay Profile Check');
  console.log('═══════════════════════════════════════════\n');

  // Validasi API Key
  validateConfig();

  try {
    console.log('\n📡 Menghubungi RonzzPay API...\n');
    const result = await getProfile();

    if (result.status) {
      console.log('✅ Koneksi berhasil!\n');
      console.log('📋 Informasi Akun:');
      console.log(`   Username : ${result.data.username}`);
      console.log(`   Nama     : ${result.data.name}`);
      console.log(`   Email    : ${result.data.email}`);
      console.log(`   WhatsApp : ${result.data.whatsapp}`);
      console.log(`   Saldo    : Rp ${result.data.balance?.toLocaleString('id-ID') || 0}`);
      console.log(`   Role     : ${result.data.role}`);
      console.log(`   Dibuat   : ${result.data.created_at}`);
    } else {
      console.log('❌ Response tidak sukses:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Gagal menghubungi RonzzPay API:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════════\n');
}

main();
