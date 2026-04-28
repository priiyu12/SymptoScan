# 🩺 SymptoScan  
### AI-Powered Symptom Based Disease Prediction & Doctor Consultation Platform

SymptoScan is an intelligent healthcare web platform that combines Machine Learning with telemedicine features to help users predict possible diseases based on symptoms and instantly connect with doctors through secure online consultation.

It provides an end-to-end digital healthcare ecosystem including AI prediction, real-time consultation chat, Razorpay payments, prediction history, and admin analytics.

---

## 🌟 Project Overview

SymptoScan was developed to improve healthcare accessibility by offering users a smart first-step diagnosis system. Instead of immediately visiting clinics for minor uncertainty, users can:

- Enter symptoms
- Get AI-based disease prediction
- View confidence score
- Consult doctors online
- Track medical interactions digitally

The platform bridges the gap between symptom awareness and professional healthcare guidance.

---

## 🚀 Core Features

### 🤖 AI Disease Prediction
- Predicts **41+ diseases** using trained Machine Learning model
- Symptom-based classification system
- Confidence score for each result
- Prediction history stored for users

### 👨‍⚕️ Doctor Consultation System
- Browse available doctors
- View specialization and fees
- Book paid consultation
- Chat with doctor in real time
- Auto-response support for first messages

### 💳 Secure Payments
- Razorpay payment gateway integration
- Consultation unlocked after successful payment
- Revenue tracking for admin dashboard

### 🔐 Authentication & Roles
- JWT based login system
- Separate dashboards for:
  - Patient
  - Doctor
  - Admin

### 📊 Admin Control Panel
- Total users
- Predictions count
- Consultations
- Revenue reports
- User management

---

## 🛠️ Technology Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js, TypeScript, Tailwind CSS |
| Backend | Django, Django REST Framework |
| Database | SQLite (Development), PostgreSQL (Production) |
| ML / AI | Scikit-learn, Pandas, NumPy |
| Auth | JWT Authentication |
| Payment | Razorpay |
| Deployment | Render + GitHub |

---

## 🧠 Machine Learning Workflow

1. User selects symptoms  
2. Symptoms converted to feature vector  
3. Trained model processes input  
4. Predicted disease generated  
5. Confidence score returned  
6. Result saved to history  
7. Option to consult doctor shown  

---

## 👤 User Modules

### Patient
- Register / Login
- Enter symptoms
- Predict disease
- View history
- Book consultation
- Chat with doctor

### Doctor
- View consultation requests
- Reply to patients
- Manage availability

### Admin
- Manage users
- View analytics
- Track revenue
- Monitor platform activity

---

## 📂 Project Structure

```bash
SymptoScan/
│── frontend/              # React Frontend
│── backend/               # Django Backend
│── predictor/             # ML Prediction APIs
│── datasets/              # Training datasets
│── model_files/           # .pkl trained models
│── README.md
