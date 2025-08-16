# 💸 Cashless Vendor+

> Empowering informal vendors to accept digital payments — no bank account, no POS, no mobile app needed.

## 🧠 About the Project

**Cashless Vendor+** is a mobile-first web platform that enables small-scale and informal vendors to accept **cashless payments** via **QR codes** or **payment links**. Built with simplicity and accessibility in mind, the platform eliminates the need for traditional banking infrastructure, expensive POS machines, or complicated fintech apps.

Developed for the **BET Hackathon 2025**, this project aims to **innovate the future of payments** by making digital transactions accessible to the informal economy.

---

## 🎯 Key Features

### For Vendors:
- 🔓 Register with just a phone number
- 📲 Instantly receive a unique QR code and payment link
- 💵 Accept payments via wallet or mock card
- 📊 View simple earnings dashboard with transaction history
- 🔁 Simulate withdrawal to mobile wallet or agent
- 📞 **USSD Access:** Vendors without smartphones can check their wallet balance and recent transactions by dialing a USSD code

### For Customers:
- 📷 Scan QR or click payment link
- 💸 Enter amount and pay via mock wallet
- ✅ Receive instant payment confirmation

---

## 🔐 Security & Privacy

- All vendor QR codes are uniquely generated and encoded
- Simulated payments are validated via backend
- No sensitive data is stored client-side
- No real payment gateway used — safe for demo and prototyping
- USSD access requires phone number authentication to protect vendor data

---

## 🧱 Tech Stack

| Layer       | Stack                                  |
|-------------|-----------------------------------------|
| Frontend    | React.js (Vite or Next.js)             |
| Backend     | Python (FastAPI)                       |
| Database    | Firebase Firestore or Supabase         |
| Auth        | Firebase Authentication (Phone/Email)  |
| QR Codes    | `qrcode` (Python/JS)                   |
| USSD        | Africa’s Talking (or similar) API + webhook logic |
| Hosting     | Vercel (frontend), Render (backend)    |

---

## 🧪 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/cashless-vendor-plus.git
cd cashless-vendor-plus

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
pip install -r requirements.txt
