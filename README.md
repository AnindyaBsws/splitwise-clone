![License](https://img.shields.io/badge/license-MIT-green)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Flask-black)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Status](https://img.shields.io/badge/status-Production--Ready-success)

# 💸 Splitwise Clone — Production-Grade Expense Sharing System

> A production-grade Splitwise clone featuring **debt simplification algorithms**, **AI-powered financial explanations**, and **real-world deployment optimizations**.

---

## 🚀 Live System

* 🌐 Frontend: https://splitwise-clone-liart.vercel.app
* 🔗 Backend API: https://splitwise-clone-gde1.onrender.com

---

## 🎥 Demo

*Will be added later*

---

## 🔥 Highlights

* Built a full-stack expense management system with **real-world deployment**
* Implemented **debt simplification algorithm using heaps**
* Integrated **AI explanations (Gemini + fallback system)**
* Solved **production issues like cold starts & DB migrations**
* Designed **scalable backend architecture with JWT auth**

---

## 🚀 Why This Project Stands Out

* Built under **real production constraints (Render free tier)**
* Handles **cold start, migrations, and API limits**
* Combines **algorithms + full-stack + AI**
* Designed with **scalability and system thinking**

---

## 📊 Key Metrics

* ⚡ Real-time balance calculation across multiple users
* 🔁 Reduced transactions using optimized debt simplification
* 🧠 AI explanations generated in seconds
* 🚀 Deployed with real-world constraints (cold start, no shell access)

---

## 🧠 Problem Statement

Group expense management systems must handle:

* Accurate financial calculations
* Minimal transaction optimization
* Real-time synchronization
* Clear explanation of debts

This project solves all of the above while handling **production constraints (cold starts, migrations, API limits)**.

---

## ⚡ Core Features

### 👥 Group & Access Control

* Role-based system (Creator / Admin / Member)
* Secure group joining via invite links or user tags
* Authorization enforced at API level

---

### 💰 Expense Engine

* Add & split expenses (equal split logic)
* Persistent **lifetime total expense tracking**
* Expense archival system (history vs active state)

---

### 🔄 Debt Simplification Algorithm

* Implemented using **min-heap / max-heap**
* Converts N transactions → minimal transactions
* Optimized for scalability

---

### 📊 Financial Accuracy

* Handles floating-point precision issues
* Ensures consistent ledger state
* Prevents invalid operations

---

### 🤖 AI-Powered Insights

* Gemini API integration
* Custom fallback (no API dependency)
* Explains:

  * Who owes whom
  * Why they owe
  * How simplification works

---

### ⚙️ System Reliability

* Cold-start mitigation (Render free tier)
* Axios retry & timeout handling
* Safe database migration strategy
* Lightweight caching

---

## 🏗️ System Design

```text
Frontend (React + Vite)
        ↓
Axios API Layer
        ↓
Flask Backend (JWT + Business Logic)
        ↓
PostgreSQL (Render DB)
```

---

## 🧩 Tech Stack

* React + Vite + Tailwind
* Flask + SQLAlchemy + JWT
* PostgreSQL (Render)
* Gemini API + Custom AI Engine

---

## 🧪 Engineering Challenges

### Cold Start Issue (Render Free Tier)

Solved backend sleep issue using retry + wake-up strategy.

### Database Migration Without Shell Access

Implemented safe startup migration fallback.

### Floating Point Precision Bug

Fixed incorrect totals using controlled rounding.

### Double State Update Bug

Refactored backend logic to maintain single source of truth.

---

## 📈 Scalability

* Stateless backend (JWT)
* Clean DB schema design
* Separation of active vs historical data
* Ready for Redis / background jobs

---

## 🧪 Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Author

**Anindya Biswas**

---

## 📄 License

MIT License
