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
- **QR Code**: qrcode (npm)
- **Webhook Signature**: crypto (built-in HMAC-SHA256)
- **Tunnel**: cloudflared

## Keamanan

- API Key disimpan di `.env` (tidak pernah di-commit)
- Webhook diverifikasi via HMAC-SHA256 signature (`X-Signature` header)
- Semua panggilan ke RonzzPay menggunakan HTTPS
- Hanya endpoint sandbox yang digunakan untuk transaksi

## Lisensi

Proyek eksperimental untuk pembelajaran. Tidak untuk produksi.
