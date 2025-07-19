# NaHa - Simplifying Financial Collaboration

## 📌 Overview
NaHa is a financial collaboration platform that enables seamless money management between partners. It provides secure authentication, wallet management, and transaction history tracking with role-based access.

## 🚀 Features
- **🔐 Authentication & Authorization**: Secure login & registration with JWT authentication.
- **💰 Wallet Management**: View balances, deposit funds, and request withdrawals.
- **🔄 Role-Based Access**:
  - **Person 1 (Owner)**: Approves/Deny withdrawal requests, views transactions.
  - **Person 2 (Partner)**: Deposits money, requests withdrawals, and tracks transactions.
- **📜 Transaction History**: Detailed records with filters for easy tracking.
- **⚡ AI-Powered Financial Assistant (Upcoming)**: Smart insights using Gemini API.

## 🛠️ Tech Stack
### Frontend:
- Vite
- React.js
- Tailwind CSS

### Backend:
- Node.js (Express.js)
- MongoDB
- JWT Authentication
- Prisma ORM

## 📂 Project Setup
### 1️⃣ Clone the Repository
```bash
$ git clone https://github.com/MANOJ-BHAMARADDI/naha.git
$ cd naha
```
### 2️⃣ Install Dependencies
#### Backend:
```bash
$ cd naha-backend
$ npm install
```
#### Frontend:
```bash
$ cd naha-frontend
$ npm install
```
### 3️⃣ Configure Environment Variables
Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5002
```
### 4️⃣ Start the Development Server
#### Backend:
```bash
$ npm run dev
```
#### Frontend:
```bash
$ npm run dev
```
### 5️⃣ Access the App

## 🎯 Roadmap
✅ MVP with role-based wallet management  
🚀 AI-powered financial insights using Autogen  

## 📜 License
This project is licensed under the MIT License.

---

### 👨‍💻 Created by [Manoj Bhamaraddi](https://github.com/MANOJ-BHAMARADDI)

