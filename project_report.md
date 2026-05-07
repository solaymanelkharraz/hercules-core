# Hercules Park Operations Tool: Project Analysis Report

Based on a comprehensive review of the frontend and backend codebase, here is a detailed breakdown of what the Hercules Park Operations Tool does, its technical architecture, and its core features.

## 🎯 Project Overview
The **Hercules Park Operations Tool** is a centralized management system designed for a park or outdoor activity center. Its primary purpose is to coordinate staff, manage park zones, track physical equipment, and handle real-time incident reporting and crisis communication ("War Room"). 

The system relies heavily on **Role-Based Access Control (RBAC)** to ensure that different types of staff (Admin, Manager, Guide, Cashier) have appropriate permissions to view or edit specific data.

---

## 🏗️ Technical Architecture

### 1. Backend (API Layer)
The backend is built using **Laravel (PHP)** and serves as a robust RESTful API.
- **Authentication & Security:** Uses **Laravel Sanctum** for secure, token-based API authentication.
- **Database:** Relational database (likely MySQL/PostgreSQL) managed via Laravel's Eloquent ORM and migrations. It includes soft-deletes to preserve historical data.
- **Roles & Permissions:** Middleware enforces access control based on user roles (`admin`, `manager`, `guide`, `cashier`).
- **Core Models & Database Tables:**
  - `User`: Staff directory containing roles, contact info (phone/email), and statuses.
  - `Zone`: Physical locations or areas within the park.
  - `Equipment`: Inventory of physical items, tools, or gear used in the park.
  - `EquipmentAssignment`: A pivot entity tracking which user is assigned which piece of equipment.
  - `IncidentReport`: Tickets tracking issues or emergencies. Linked to the user reporting it, the zone it occurred in, and any involved equipment. Features severity levels and statuses.
  - `Message`: Chat messages associated with a specific incident report (supports image paths).
  - `Alert`: Global notifications broadcasted across the system.

### 2. Frontend (Client Layer)
The frontend is a modern Single Page Application (SPA) built with **React** and **Vite**.
- **Routing:** Utilizes `react-router-dom` to handle navigation, with a `<ProtectedRoute>` wrapper ensuring only authenticated users can access the system.
- **State Management:** React Context API (`AuthContext`) is used to manage the current user session.
- **Styling:** Styled with **Tailwind CSS** (v4) for a responsive, modern interface.
- **Notifications:** Uses `sonner` for rich toast notifications.

---

## 🚀 Core Features & Modules

### 👥 User & Staff Management
- **Directory (`/directory`):** A public (internal) view for staff to find contact information for other team members.
- **User Administration (`/users`):** Admins and Managers can add, update, and remove staff members, assign roles, and manage their access.

### 🗺️ Zone Management (`/zones`)
- Allows Admins and Managers to define and monitor different operational areas of the park. Other staff can view these zones but not edit them.

### 🛠️ Equipment Tracking (`/equipment` & `/assignments`)
- **Inventory:** Tracks all gear, including its current condition and location. Accessible to Admins, Managers, and Cashiers.
- **Assignments:** Keeps a ledger of who checked out what equipment, ensuring accountability.

### 🚨 Incident Reporting (`/incidents`)
- **Ticketing System:** Staff (Guides, Managers, Admins) can log issues ranging from minor maintenance needs to severe emergencies.
- **Tracking:** Each incident includes a severity level, description, associated zone, and equipment, and tracks its resolution status.

### 💬 Crisis Chat / War Room (`/incidents/:id/chat`)
- **Real-Time Communication:** A dedicated chat interface tied directly to a specific Incident Report.
- **Media Support:** The backend supports image uploads (`image_path` in migrations) allowing staff to share photos from the field.
- **Coordination:** Enables rapid, centralized coordination between the field (Guides) and the command center (Admins/Managers) to resolve crises.

### ⚠️ Global Alerts
- The system includes an `alerts/latest` polling/broadcasting mechanism and a `GlobalAlert` component in the frontend to push critical, park-wide announcements to all active users instantly.

---

## 📝 Summary
The Hercules core is a highly structured, production-ready SaaS-like tool specifically tailored for physical operations. It bridges the gap between field workers and management by providing a "single pane of glass" for inventory tracking, spatial awareness (zones), and emergency response coordination.
