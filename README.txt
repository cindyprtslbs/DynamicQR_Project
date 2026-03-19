==================================================
📡 Telemetry & QR Presence System v1
==================================================

PROJECT README
Telemetry & QR Presence System v1

Deskripsi:
Sistem berbasis web untuk monitoring sensor (accelerometer & GPS)
serta presensi menggunakan QR Code dinamis dengan backend
Google Apps Script.

Sistem ini terdiri dari 3 modul utama:
- Accelerometer Client (accel.html)
- GPS Tracker (gps.html)
- QR Presence Scanner (scan.html)

Sistem mengirim data sensor dan presensi ke Google Apps Script
backend menggunakan REST API berbasis JSON.

==================================================
⚙️ PERSYARATAN
==================================================

- Browser modern (Chrome / Edge)
- HTTPS (WAJIB untuk sensor & GPS)
- Kamera (untuk QR Scanner)
- Koneksi internet

==================================================
🚀 CARA MENJALANKAN (HOW TO RUN)
==================================================

Persiapan:

Pastikan semua file HTML berada dalam satu folder:
- accel.html
- gps.html
- scan.html

Jalankan via Browser:
- Klik dua kali file HTML
ATAU
- Gunakan Live Server (VSCode Extension)
ATAU
- Gunakan web server lokal seperti XAMPP

Contoh menggunakan Live Server:
- Install extension Live Server di VSCode
- Klik kanan file → Open with Live Server

--------------------------------------------------

Izin Sensor:
Untuk accel.html dan gps.html:

- Gunakan HTTPS (karena sensor & GPS butuh secure origin)
- Berikan izin akses sensor dan lokasi saat diminta browser

==================================================
🔗 BASE URL
==================================================

Setiap modul memiliki BASE_URL masing-masing:

ACCELEROMETER:
https://script.google.com/macros/s/AKfycbwOARo3-vfC-44VcO30KZ1PLVntW6s-iRXrhwYY9aVfMNPM36i2oYIYoXp8fAPlXNlx/exec

GPS:
https://script.google.com/macros/s/AKfycbytvsRFhjR45af_ly5AiHv-c2gPJ5oRADjfREgFDHB3N2VTn5NBcY7Q3CW8XcVv10qY/exec

PRESENCE:
https://script.google.com/macros/s/AKfycbyTPZsVHNWOo176DZBhExkDSzy2cSriBxttIQ4-pp5xbBM_sUSPaMqRk1UofhPxStQ/exec

Format endpoint:
BASE_URL + ?path=/endpoint

==================================================
📡 API CONTRACT
==================================================

1. TELEMETRY ACCELEROMETER

POST /telemetry/accel

Request:
{
  "device_id": "dev-abc123",
  "ts": "2026-03-01T14:22:10.123Z",
  "samples": [
    {
      "t": "2026-03-01T14:22:08.111Z",
      "x": 0.12,
      "y": -0.45,
      "z": 9.81
    }
  ]
}

Contoh Fetch:
fetch(BASE_URL + "?path=/telemetry/accel", {
  method: "POST",
  body: JSON.stringify(payload)
})

GET /telemetry/accel/latest

Contoh:
?path=/telemetry/accel/latest&device_id=dev-abc123

--------------------------------------------------

2. TELEMETRY GPS

POST /telemetry/gps

Request:
{
  "device_id": "dev-abc123",
  "ts": "2026-03-01T14:25:00.000Z",
  "lat": -7.2575,
  "lng": 112.7521,
  "accuracy_m": 5
}

GET /telemetry/gps/history

Contoh:
?path=/telemetry/gps/history&device_id=dev-abc123&limit=100

--------------------------------------------------

3. PRESENCE CHECK-IN

POST /presence/checkin

Request:
{
  "user_id": "220411100123",
  "device_id": "web-x1y2z3",
  "course_id": "IF101",
  "session_id": "S1",
  "qr_token": "abc123token",
  "ts": "2026-03-01T14:30:00.000Z"
}

==================================================
📦 FORMAT RESPONSE
==================================================

Success:
{
  "ok": true,
  "data": {}
}

Error:
{
  "ok": false,
  "error": "Error message"
}

==================================================
🔄 ALUR SISTEM
==================================================

ACCELEROMETER:
Start → Tangkap sensor → Kirim batch tiap 3 detik → 
Ambil latest tiap 2 detik → Update chart

GPS:
Start → Ambil koordinat → Kirim ke server → 
Load history → Tampilkan polyline

QR PRESENCE:
Input NIM → Scan QR → Ambil token dari URL → 
Kirim check-in ke server → Tampilkan status

==================================================
🖥️ FITUR TAMBAHAN (DARI IMPLEMENTASI)
==================================================

- Real-time chart (Chart.js)
- Live GPS map (Leaflet.js)
- Multi-device tracking
- Dynamic QR (token berubah tiap 10 detik)
- Auto expired QR (120 detik)
- Monitoring dashboard (ACTIVE / OFFLINE)

==================================================
🔧 TIPS PENGGUNAAN
==================================================

- Gunakan HP untuk accelerometer
- Aktifkan GPS dengan high accuracy
- Scan QR sebelum expired

==================================================
🐛 TROUBLESHOOTING
==================================================

Sensor tidak jalan:
- Pastikan HTTPS
- Gunakan mobile browser

GPS tidak muncul:
- Aktifkan lokasi
- Izinkan browser

QR tidak bisa scan:
- Pastikan kamera aktif
- Gunakan browser modern

API error:
- Deploy Google Apps Script:
  - Deploy as Web App
  - Access: Anyone

==================================================
📝 CATATAN PENTING
==================================================

- Sistem membutuhkan koneksi internet
- Sensor hanya berjalan di HTTPS
- QR Scanner menggunakan kamera device
- Google Apps Script harus "Deploy as Web App"

==================================================
💡 PENGEMBANGAN LANJUT
==================================================

- Dashboard analytics
- Notifikasi real-time
- Integrasi database
- Authentication system
- Export data (CSV/Excel)

==================================================
👨‍💻 AUTHOR
==================================================

Telemetry & QR Presence System Project

==================================================