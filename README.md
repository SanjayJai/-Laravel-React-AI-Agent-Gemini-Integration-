A modern full-stack application built with Laravel (Backend) and React (Frontend), enhanced with an AI Assistant Agent powered by Google Gemini API.# 🚀 Laravel + React AI Agent (Gemini Integration)

A modern full-stack application built with **Laravel (Backend)** and **React (Frontend)**, enhanced with an **AI Assistant Agent** powered by **Google Gemini API**.

---

## 📸 Demo Preview

> Place your screenshot image in the root folder and rename it as `demo.png`

---

## 🧠 Features

* ✅ Laravel REST API (CRUD operations)
* ✅ React Admin Dashboard UI
* ✅ Categories & Products Management
* ✅ Orders & Order Items Tracking
* ✅ AI Assistant Chat (Gemini API)
* ✅ Dynamic Query Handling (Orders, Products, Price Filters)
* ✅ Real-time Chat UI
* ✅ Clean and Modern UI Design

---

## 🛠️ Tech Stack

### Backend

* Laravel 10/11/12+
* MySQL Database
* RESTful APIs

### Frontend

* React.js
* Axios
* Tailwind CSS / Bootstrap

### AI Integration

* Google Gemini API

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

---

### 2️⃣ Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### Configure Database

Edit `.env` file:

```env
DB_DATABASE=your_db
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

Start server:

```bash
php artisan serve
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🤖 Gemini AI Setup

1. Go to Google AI Studio
2. Generate API Key
3. Add in `.env`

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 📡 API Example (AI Agent)

### Request

```json
{
  "message": "Show orders"
}
```

### Response

```json
{
  "response": "There is 1 order in the system..."
}
```

##

## 💡 AI Use Cases

* 🔍 Get total orders
* 💰 Calculate total revenue
* 📦 Filter products by price
* 📊 Inventory insights
* 🤖 Natural language queries

---

## 🔐 Security Tips

* Never expose API keys in frontend
* Use `.env` for secrets
* Enable CORS properly

---

## 🚀 Future Improvements

* Authentication (JWT)
* Role-based access
* AI Voice Assistant
* Advanced Analytics Dashboard

---

## 👨‍💻 Author

**Sanjay (Laravel & React Developer)**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Contribute

---

## 📜 License

This project is open-source and available under the MIT License.
