# 🏥 Full-Stack Healthcare Appointment System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A premium, SaaS-style healthcare portal that connects patients with doctors. It features robust role-based authentication, an algorithmic scheduling engine, and a highly responsive, dark-themed user interface designed for maximum operational efficiency.

## ✨ Key Features

### 🔐 Authentication & Security
* **Role-Based Access:** Distinct secure portals for Patients and Doctors.
* **JWT Authentication:** Encrypted token-based login and registration flows.

### 🧑‍⚕️ Doctor Portal
* **Algorithmic Slot Generator:** Automatically calculates and generates 15, 30, 45, and 60-minute availability arrays based on shift hours and lunch breaks (calculating via "Minutes Since Midnight" logic).
* **Schedule Management:** Real-time dashboard to view booked patients, complete appointments, or cancel them.
* **KPI Dashboard:** Visual metrics tracking open slots, total visits, and appointment statuses.
* **Clinical Records:** View detailed patient medical history dynamically attached to appointment modals.

### 🤒 Patient Portal
* **Smart Booking System:** Filter available doctors by specialization using deduplicated data sets and book open time slots.
* **Dynamic Appointment Tabs:** Clean separation of "Upcoming" and "Past" appointment history using derived React state.
* **Progressive Disclosure UI:** Complex medical data and appointment actions are hidden inside sleek, animated pop-up modals to reduce cognitive load.
* **Comprehensive User Profiles:** Displays demographic data, emergency contact info, and an ongoing array of medical history.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Functional Components & Custom Hooks)
* Tailwind CSS (Utility-first styling, custom scrollbars, animated states)
* React Router DOM (Navigation)

**Backend:**
* Node.js & Express.js (RESTful API architecture)
* MongoDB & Mongoose (Schema validation & data modeling)
* JSON Web Tokens (JWT) for stateless authentication

## 📂 Project Structure

This project follows a clean, decoupled MVC (Model-View-Controller) architecture, strictly separating the client interface from the API server and isolating business logic from routing.

```text
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Modals, Cards, Nav)
│   │   ├── hooks/           # Custom React hooks (e.g., useUpdateAppointment)
│   │   ├── pages/           # Route views (DoctorPortal, PatientProfile)
│   │   └── utils/           # Helper functions (Time conversions, Formatters)
│   └── package.json
│
└── backend/
    ├── config/              # Database connection setup (db.js)
    ├── controllers/         # Core business logic & database interactions
    ├── middleware/          # Custom route protection and token verification (auth.js)
    ├── models/              # Mongoose Schemas (appointment, doctor, patient)
    ├── routes/              # Express API Endpoints routed to controllers
    ├── server.js            # App entry point & global configuration
    └── .env                 # Environment variables (Mongo URI, JWT Secret)