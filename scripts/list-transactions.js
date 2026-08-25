/**
 * Script untuk mengecek riwayat transaksi dari API RonzzPay.
 * Mendukung filter status dan pagination.
 */

const { config, validateConfig } = require('../src/config');
const { listTransactions } = require('../src/services/ronzzpay');

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  Riwayat Transaksi (List Transactions)');
  console.log('═══════════════════════════════════════════\n');

  validateConfig();

  // Parsing arguments CLI
  const args = process.argv.slice(2);
  const options = {};

  args.forEach(arg => {
    if (arg.startsWith('--status=')) {
      options.status = arg.split('=')[1];
    } else if (arg.startsWith('--page=')) {
      options.page = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--perPage=')) {
      options.perPage = parseInt(arg.split('=')[1], 10);
    }
  });

  try {
    console.log(`📡 Menarik data dari server...`);
    if (Object.keys(options).length > 0) {
      console.log(`   Filter: ${JSON.stringify(options)}`);
    }
    console.log();

    const result = await listTransactions(options);

    if (result.status && result.data) {
      const transactions = result.data; // Array of transactions
      const meta = result.pagination; // Pagination info

      if (!transactions || transactions.length === 0) {
        console.log('ℹ️ Tidak ada riwayat transaksi yang ditemukan.');
        return;
      }

      console.table(transactions.map(t => ({
        'Reff ID': t.reff_id,
        'Amount': `Rp ${t.amount}`,
        'Status': t.status,
        'Metode': t.payment_name || t.code,
        'Tgl Dibuat': t.created_at
      })));

      if (meta) {
        console.log(`\nHalaman: ${meta.current_page} / ${meta.last_page} | Total: ${meta.total} transaksi`);
      }
    } else {
      console.log('❌ Response tidak sukses:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Gagal mengambil riwayat transaksi:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
  }
}

main();
