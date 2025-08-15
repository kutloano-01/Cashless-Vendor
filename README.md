# WayFinder
Campus WayFinder+

Smart Campus Navigation Meets Seamless Student Payments

Campus WayFinder+ is a hackathon project built at the BET Hackathon to help varsity students easily navigate their university campus while enabling integrated, cashless payments for everyday services — all through one intuitive platform.

🚀 Project Overview

Campus WayFinder+ combines interactive campus navigation with a student-friendly payment system. Students can find lecture halls, libraries, cafeterias, and more — then make payments (simulated in this MVP) for food, printing, or peer transfers seamlessly within the app.

🎯 Features

Campus Map & Navigation:
Interactive map with key campus locations and simple route guidance.

Student Wallet:
Manage balance, view transaction history, and simulate payments.

Peer-to-Peer Payments:
Send and receive funds between students with ease.

QR Code Payment Simulation:
Mock payments via QR code scanning to represent contactless transactions.

User Authentication:
Secure sign-up and login flow using Firebase Authentication.

🛠 Tech Stack

Frontend: React

Backend: Python (FastAPI)

Authentication & Database: Firebase (Auth & Firestore)

Maps: Google Maps API / OpenStreetMap

Payment Simulation: Mock transactions (no real money)

Cloud Hosting: Firebase Functions / AWS / GCP (optional)

📦 Getting Started
Prerequisites

Node.js & npm

Python 3.8+

Firebase CLI (if using Firebase)

Google Maps API Key (for map features)

Installation

Clone the repo:

git clone https://github.com/yourusername/campus-wayfinder.git
cd campus-wayfinder


Frontend setup:

cd frontend
npm install
npm start


Backend setup:

cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload


Configure Firebase and Google Maps API keys in .env files

🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

📄 License

MIT License

🙏 Acknowledgments

Built at the BET Hackathon — innovating the future of payments for varsity students.
