# Hercules Park Operations Tool

![Hercules Core](https://img.shields.io/badge/status-active-success.svg)

Hercules Park Operations Tool is a comprehensive, centralized park management system. Designed for outdoor activity centers and parks, it bridges the gap between field workers and management by providing a "single pane of glass" for inventory tracking, spatial awareness, and emergency response coordination.

## 🎯 Key Features

- **👥 Role-Based Access Control (RBAC):** Strict permissions and views tailored for Admins, Managers, Guides, and Cashiers.
- **🗺️ Zone Management:** Define and monitor operational areas within the park.
- **🛠️ Equipment Tracking & Assignments:** Real-time inventory tracking and ledger for checking out gear to staff.
- **🚨 Incident Reporting:** Ticketing system for logging issues, ranging from maintenance needs to severe emergencies.
- **💬 Crisis Chat (War Room):** Dedicated, real-time chat interface tied to specific incidents for rapid coordination, complete with media upload support.
- **⚠️ Global Alerts:** Broadcast critical announcements instantly to all active park staff.

## 🏗️ Technical Architecture

This repository is organized as a monorepo containing both the frontend and backend applications.

### Backend (`/backend`)
A robust RESTful API built with **Laravel (PHP)**.
- **Authentication:** Laravel Sanctum
- **Database:** Relational database with Eloquent ORM & migrations
- **Access Control:** Role-based middleware

### Frontend (`/frontend`)
A modern, responsive Single Page Application (SPA) built with **React** & **Vite**.
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Styling:** Tailwind CSS (v4)
- **Notifications:** Sonner

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+ and Composer
- Node.js 18+ and npm
- A relational database (MySQL/PostgreSQL/SQLite)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your environment file:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your database credentials in `.env`, then run migrations:
   ```bash
   php artisan migrate
   ```
5. Start the development server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure the API endpoint if necessary (defaults to `http://localhost:8000`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🔐 User Roles
The system enforces the following roles:
- **Admin:** Full access to all modules, including user management and system configuration.
- **Manager:** Operational oversight, can manage zones, equipment, and staff assignments.
- **Guide:** Field staff. Can view assignments, report incidents, and participate in crisis chats.
- **Cashier:** Front desk staff. Can view and manage equipment checkout.

---
*Built for the field. Designed for control.*
