/**
 * Auto-polling service.
 * Mengecek status transaksi yang masih "pending" secara berkala ke API RonzzPay.
 */

const { getTransactionStatus } = require('./ronzzpay');
const store = require('../store/transactions');

// Interval polling (misal: tiap 10 detik)
const POLLING_INTERVAL = 10000;

let pollingTimer = null;

async function checkPendingTransactions() {
  const transactions = store.getAll();
  // Filter yang masih pending
  const pending = transactions.filter(t => t.status === 'pending');

  if (pending.length === 0) return;

  console.log(`\n⏳ Auto-polling: Mengecek ${pending.length} transaksi pending...`);

  for (const trx of pending) {
    try {
      const result = await getTransactionStatus(trx.reff_id);
      
      if (result.status && result.data) {
        const newStatus = result.data.status;
        if (newStatus !== 'pending') {
          store.updateStatus(trx.reff_id, newStatus);
        }
      }
    } catch (error) {
      console.error(`Gagal cek status ${trx.reff_id}:`, error.message);
    }
  }
}

/**
 * Start auto polling.
 */
function startPolling() {
  if (!pollingTimer) {
    console.log('🔄 Auto-polling transaksi pending diaktifkan.');
    pollingTimer = setInterval(checkPendingTransactions, POLLING_INTERVAL);
  }
}

/**
 * Stop auto polling.
 */
function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    console.log('🛑 Auto-polling transaksi dihentikan.');
  }
}

module.exports = {
  startPolling,
  stopPolling
};
