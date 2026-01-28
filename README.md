# HRMS Lite – Full-Stack Coding Assignment

A lightweight **HRMS Lite (Human Resource Management System)** web application built to simulate a basic internal HR tool.  
This project allows a single admin user to manage employees and track daily attendance with a simple, usable, and professional interface.

---

## ✅ Live Application URL

🌐 **Live Project:**  
https://hrms-lite-frontend-app.vercel.app/

---

## ✅ GitHub Repository Link

📌 **GitHub Repo:**  
https://github.com/Rajnish2000/hrms-lite-app

---

## 📌 Project Overview

This HRMS Lite application includes two core modules:

### 1) Employee Management

Admin can:

- Add a new employee with:
  - Employee ID (**unique**)
  - Full Name
  - Email Address (**unique + validated**)
  - Department
- View list of employees
- Delete an employee

### 2) Attendance Management

Admin can:

- Mark daily attendance for employee with:
  - Date
  - Status: Present / Absent
- View attendance records per employee

---

## ✅ Tech Stack Used

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Django
- Django REST Framework (DRF)
- MongoDB Atlas
- MongoEngine
- Gunicorn

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🛠 Steps to Run the Project Locally

### 1) Clone the repo

```bash
git clone https://github.com/Rajnish2000/hrms-lite-app.git
cd hrms-lite-app

```

## 🛠 Steps to Run the Project Locally

---

## 2) Backend Setup (Django + MongoDB)

### Step A: Create virtual environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux
```

### Step B: Install dependencies

\\\ash
pip install -r requirements.txt
\\\

### Step C: Setup environment variables

Create a file: \ackend/.env\

Add the following:

\\\env
DEBUG=True
SECRET_KEY=your_secret_key
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hrms_lite?retryWrites=true&w=majority
\\\

**Note:** Replace \<username>\, \<password>\, and cluster details with your MongoDB Atlas credentials.

### Step D: Run backend server

\\\ash
python manage.py runserver
\\\

Backend runs at: **http://127.0.0.1:8000/api/**

---

## 3) Frontend Setup (React)

### Step A: Install dependencies

\\\ash
cd ../hrms-frontend
npm install
\\\

### Step B: Setup environment variables

Create a file: \hrms-frontend/.env\

Add the following:

\\\env
VITE_API_BASE=http://127.0.0.1:8000/api
\\\

### Step C: Run frontend server

\\\ash
npm run dev
\\\

Frontend runs at: **http://localhost:5173**

---
