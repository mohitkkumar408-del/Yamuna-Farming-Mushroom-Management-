# Yamuna Farming – Complete Mushroom Farming Management Platform

> **Business Name:** Yamuna Farming (यमुना फार्मिंग)  
> **Owner & Operator:** Mohit Kumar Mahato (मोहित कुमार महतो)  
> **Currency:** Indian Rupees (₹ INR)  
> **Language Support:** English & हिन्दी (Hindi)  

Yamuna Farming is a modern, responsive, commercial mushroom farming and agro-sales management platform. It manages the entire mushroom farming business lifecycle from a single application: production batch tracking, fresh inventory, customer bookings, delivery logistics, supplier ledgers, expenses, real-time cashbook, and profit & loss analysis.

---

## 🌟 Key Features

### 1. Business Dashboard
- Real-time KPIs: Total mushrooms produced (kg), total sold/dispatched (kg), available fresh stock (kg), today's harvest output, today's sales revenue (₹), and customer dues.
- 7-stage order pipeline counter: New, Confirmed, In Preparation, Ready for Dispatch, Dispatched, Delivered, and Cancelled.
- Visual charts: 7-day harvest vs sales trends, live fresh stock distribution by variety.
- Proactive alert ticker for low stock, orders due for delivery today, and upcoming harvest dates.

### 2. Mushroom Production Tracking
- Manage cultivation batches (Oyster/ढींगरी, Button/बटन, Milky/दूधिया, Shiitake, Paddy Straw).
- Track bag counts, room assignment, spawn quantity & cost, substrate quantity & cost, labour wages, electricity/water utilities, packaging, and other overheads.
- Automatic calculation of total batch investment and cost per bag.
- Progress monitoring across stages: Inoculation ➔ Spawn Run ➔ Pinheading ➔ Harvesting Active ➔ Completed.

### 3. Harvest Management & Quality Grading
- Flush-by-flush logging (Flush 1, Flush 2, Flush 3, Flush 4).
- Multi-tier quality grading:
  - **Grade A (Premium Market)**
  - **Grade B (Standard Market)**
  - **Grade C (Processing / Pickling)**
  - **Spoiled / Damaged**
- Automatic calculation of net fresh weight and instant addition to the inventory stock.

### 4. Stock & Inventory Management (FIFO & Reservation Safeguards)
- Real-time stock for fresh mushrooms: Total Harvested, Reserved, Dispatched, Spoiled, and Available.
- Raw materials inventory: Spawn, Pasteurized Wheat Straw, PP Growing Bags, and Sanitization Chemicals.
- FIFO stock movements audit trail logging every stock event with timestamp, reason, and linked order/batch.
- Automatic stock reservations upon order confirmation; prevents overselling and negative stock.
- Instant stock release if an order is cancelled.

### 5. Order Management & Invoicing
- Full order lifecycle tracking with unique IDs (`YF-ORD-YYYY-XXX`).
- Customer selection with auto-fill or inline creation.
- Price calculation with custom discounts, delivery charges, advance deposits, and balance due.
- Print-ready commercial tax invoices with Yamuna Farming official letterhead and Mohit Kumar Mahato's authorization block.

### 6. Delivery Logistics
- Track delivery codes (`YF-DEL-XXX`) linked to customer orders.
- Assign delivery drivers, vehicles, and transport costs.
- Partial delivery support with automatic order fulfillment completion.

### 7. Customer & Supplier Ledgers
- Complete customer directory (Hotels, Sabzi Mandi Wholesalers, Retailers).
- Downloadable and printable Customer Statement of Account (ledger showing all invoices, payments, and balance due).
- Supplier accounts for spawn laboratories, straw depots, and packaging vendors.

### 8. Payments & Daily Cashbook
- Unified cashbook tracking Cash IN (customer payments, advance receipts) and Cash OUT (expenses, labour payouts).
- Payment method support: Cash, UPI (GPay/PhonePe), Bank Transfer (NEFT/IMPS), and Cheque.
- Running live cash balance calculation.

### 9. Operating Expenses & Profit/Loss (P&L)
- Categorized expenditures: Spawn, Substrate, Labour, Utilities, Packaging, Transport, Rent, Maintenance.
- Accrual vs Cash-basis accounting:
  - Gross Revenue vs Cash Collected
  - Cost of Goods Sold (COGS) based on batch costs
  - Gross Profit, Net Operating Profit, and Profit Margin %.

### 10. Reports, Alerts & Security
- Export any dataset to CSV (Orders, Harvests, Customers, Expenses).
- Printable Executive Summary Report for audits and banks.
- Role-based authorization simulation (Owner, Farm Manager, Worker) with 4-digit quick access PIN.
- One-click JSON database backup download and restore.
- PostgreSQL / Supabase SQL schema generator for cloud database deployment.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Storage:** LocalStorage + JSON Snapshot Engine with automated relational safeguards
- **Cloud Database Ready:** Full PostgreSQL / Supabase DDL schema provided in the application

---

## 🚀 Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohitkkumar408/yamuna-farming.git
   cd yamuna-farming
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a database on [Supabase](https://supabase.com) or any PostgreSQL host.
2. Navigate to the **Backup & Cloud DB** tab in the Yamuna Farming website.
3. Click **"Copy Schema SQL"**.
4. In Supabase, open the **SQL Editor**, paste the script, and execute it.
5. All 11 tables (`users`, `production_batches`, `harvest_records`, `mushroom_stocks`, `customers`, `orders`, `deliveries`, `payments`, `expenses`, `stock_movements`, `raw_materials`) and constraints will be provisioned.

---

## 📋 Feature Verification Checklist

- [x] **Hindi / English Toggle:** Tested instant language switch in header.
- [x] **Production Batch:** Created new batch, verified cost summation and stage transitions.
- [x] **Harvest Logging:** Logged harvest with Grade A, B, C; confirmed automatic stock increase.
- [x] **Stock Reservation:** Confirmed order reserves stock; cancellation releases reservation.
- [x] **Dispatched Fulfillment:** Moving order to dispatched/delivered deducts stock correctly.
- [x] **Invoice Printing:** Opened invoice preview and checked print formatting.
- [x] **Cashbook & Payments:** Logged advance payment; verified order balance and cashbook balance update.
- [x] **P&L Calculations:** Verified gross profit, net profit, and profit margin formulas.
- [x] **CSV Exports:** Tested CSV download for Orders, Harvests, Customers, and Expenses.
- [x] **Backup & Restore:** Verified JSON backup download and file restore.

---

© 2026 **Yamuna Farming** • Owned and operated by **Mohit Kumar Mahato**
