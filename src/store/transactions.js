/**
 * In-memory store untuk tracking transaksi.
 * Menyimpan state transaksi selama server berjalan.
 * 
 * Catatan: Data hilang saat server restart. 
 * Untuk persistence, bisa diganti SQLite di tahap selanjutnya.
 */

const transactions = new Map();

/**
 * Simpan atau update transaksi.
 * @param {string} reffId - Reference ID dari RonzzPay
 * @param {object} data - Data transaksi lengkap
 */
function save(reffId, data) {
  transactions.set(reffId, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  console.log(`📝 Transaction ${reffId} saved (status: ${data.status || 'unknown'})`);
}

/**
 * Ambil transaksi berdasarkan reffId.
 * @param {string} reffId
 * @returns {object|undefined}
 */
function get(reffId) {
  return transactions.get(reffId);
}

/**
 * Ambil semua transaksi.
 * @returns {object[]}
 */
function getAll() {
  return Array.from(transactions.values());
}

/**
 * Update status transaksi.
 * @param {string} reffId
 * @param {string} newStatus - 'pending', 'success', 'failed', 'expired'
 */
function updateStatus(reffId, newStatus) {
  const existing = transactions.get(reffId);
  if (existing) {
    existing.status = newStatus;
    existing.updatedAt = new Date().toISOString();
    transactions.set(reffId, existing);
    console.log(`🔄 Transaction ${reffId} status updated → ${newStatus}`);
  }
}

/**
 * Jumlah total transaksi di store.
 * @returns {number}
 */
function count() {
  return transactions.size;
}

module.exports = {
  save,
  get,
  getAll,
  updateStatus,
  count,
};
