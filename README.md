# RonzzPay Sandbox — Payment Gateway Integration

Proyek percobaan integrasi **RonzzPay** payment gateway (QRIS, e-wallet) menggunakan **mode sandbox**.  
Semua transaksi bersifat simulasi — tidak ada saldo asli yang terpengaruh.

## Quick Start

### 1. Clone & Install

```bash
git clone git@github.com:Renohidayat/payment-sandbox.git
cd payment-sandbox
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env → isi RONZZPAY_API_KEY dari dashboard RonzzPay
```

### 3. Validasi Koneksi

```bash
node scripts/check-profile.js
```

### 4. Jalankan Server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`

## Endpoint Lokal

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/profile` | Cek koneksi & info akun RonzzPay |
| POST | `/transaction/create` | Buat transaksi sandbox (QRIS/e-wallet) |
| GET | `/transaction/status/:reffId` | Cek status transaksi |
| POST | `/webhook` | Receiver webhook dari RonzzPay |
| GET | `/transactions` | List transaksi + pagination |

## Webhook Testing (Tunnel)

Untuk menerima webhook dari RonzzPay saat development lokal, gunakan tunnel:

```bash
# Cloudflared (gratis, tanpa akun)
cloudflared tunnel --url http://localhost:3000
```

Gunakan URL tunnel sebagai `webhook_url` saat membuat transaksi.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Environment**: dotenv
-## 🧪 End-to-End Testing (Sandbox & Webhook)

Karena ini menggunakan webhook, server lokal Anda harus bisa diakses dari internet agar RonzzPay bisa mengirimkan notifikasi. Anda bisa menggunakan [Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps) (disarankan) atau [Ngrok](https://ngrok.com/).

### Menggunakan Cloudflared
1. Install cloudflared. (Di Windows: `winget install --id Cloudflare.cloudflared`).
2. Jalankan server lokal:
   ```bash
   npm run dev
   ```
3. Buka terminal baru dan jalankan tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
4. Copy URL tunnel yang dihasilkan (contoh: `https://your-tunnel.trycloudflare.com`).
5. Uji pembuatan transaksi dengan mengubah variabel `webhookUrl` di `scripts/create-transaction.js` menjadi `https://your-tunnel.trycloudflare.com/webhook`.
6. Simulasikan pembayaran di dashboard Sandbox RonzzPay dan webhook akan masuk ke server lokal Anda.
7. Anda juga bisa mensimulasikan webhook secara lokal tanpa tunnel menggunakan:
   ```bash
   node scripts/test-webhook.js <REFF_ID>
   ```

## Keamanan

- API Key disimpan di `.env` (tidak pernah di-commit)
- Webhook diverifikasi via HMAC-SHA256 signature (`X-Signature` header)
- Semua panggilan ke RonzzPay menggunakan HTTPS
- Hanya endpoint sandbox yang digunakan untuk transaksi

## Lisensi

Proyek eksperimental untuk pembelajaran. Tidak untuk produksi.
