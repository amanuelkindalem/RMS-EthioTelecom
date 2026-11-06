# EthioTelecom Refueling Management System (RMS) - Frontend

Frontend web dashboard and mobile driver application for **EthioTelecom Refueling Management System (RMS)**, based on the **Addis Ababa University Department of Computer Science SRS Specification (December 2025)** and integrated with the NestJS + Prisma backend.

---

## 🚀 Features & SRS Requirements Implemented

### 1. Dual-Platform Architecture (SRS Section 3 & 8.1)
- **Web Dashboard**: Tailored for HQ Admins, Branch Admins, Refueling Teams, Refuel Managers, Finance Teams, and Fleet Admins.
- **Driver Mobile Application**: Responsive smartphone interface for drivers with offline queueing and instant status tracking.

### 2. Functional Requirements (FR) & Use Cases (UC)
| Use Case / FR | Primary Actor | Description & Implementation |
|---|---|---|
| **UC 1 / FR-1** | HQ Admin / Branch Admin | **User & Role Management**: RBAC provisioning, branch isolation, role hierarchy, deactivation. |
| **UC 2 / FR-2** | Refueling Team | **Open Fuel Session**: Validates approved ERD task reference, selects driver, vehicle, and branch. |
| **UC 3 / FR-3** | Refueling Team | **Record Initial Vehicle State**: Captures odometer start (km) and fuel level start (liters). |
| **UC 4** | Refueling Team | **Record Trip Metadata**: Departure, destination, department, description, and time-out. |
| **UC 5 / FR-4** | Driver | **Submit Fuel Request**: Mobile fuel request submission with optional justification. |
| **Offline Sync** | Driver | **Offline Capability**: Requests are queued in local cache when offline and sync automatically upon reconnection. |
| **UC 6 / FR-5** | Refueling Manager | **Review & Authorize**: Full or partial approval with volume adjustment & manager verification comments, or rejection. |
| **UC 7 / FR-6** | Finance Team | **Financial Disbursement**: Calculates fuel cost, processes Telebirr voucher / bank transfer / cash, records transaction reference. |
| **UC 8 / FR-7** | Refueling Team | **Record Final Vehicle State & Close**: Final odometer and fuel readings at trip completion. |
| **UC 9 / FR-8** | System / Refuel Team | **Fuel Consumption Analysis**: Automatic audit comparing actual fuel used vs. standard vehicle consumption ($Distance \times StandardConsumption$). |
| **UC 10 / FR-9**| Refueling Manager | **Fraud & Discrepancy Alerts**: Flags sessions where variance exceeds 10%. Refuel Manager logs investigation notes & action taken. |
| **UC 11 / FR-10**| Manager & Admins | **Analytics & Audit Logs**: Branch summaries, vehicle efficiency logs, financial disbursement ledgers, and printable reports. |

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Modern EthioTelecom design system (`#005a9c` Blue & `#7cb342` Green)
- **State & Context**: `AuthContext` (RBAC & multi-role testing switcher), `OfflineContext` (device offline queue)
- **API Integration**: REST client communicating with NestJS backend via Vite `/api` proxy

---

## 💻 Running the Application

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`.

### 3. Quick Role Switcher
Use the **Active Role** dropdown in the top navbar to instantly test any persona:
- `HQ_ADMIN`
- `BRANCH_ADMIN`
- `REFUELING_TEAM`
- `REFUELING_MANAGER`
- `FINANCE`
- `FUEL_ADMIN`
- `DRIVER` (Toggles the mobile smartphone view)

