# Requirement Understanding — Inventory Management System (React POC)

## 1. Purpose

An organization keeps items such as laptops, keyboards, mice, monitors, printers, network accessories and office supplies. Today the stock is tracked manually or in Excel.

This POC is a simple **React frontend application** that lets the organization:

- Maintain product, category and supplier information
- Record stock coming in (receipts) and going out (issues)
- Correct stock differences found during physical checks
- See the available quantity of every product
- Find products that need to be re-ordered
- View and export inventory reports

The goal of the POC is to show that I can understand business requirements, build a working React application, apply business rules, and handle data **without a backend or database**.

## 2. Scope

### In scope

- Inventory Dashboard
- Product Management (list, add/edit, details)
- Category Management
- Supplier Management
- Stock In (receipts)
- Stock Out (issues)
- Stock Adjustment
- Stock Transaction History
- Low Stock Alerts
- Inventory Reports
- Search, filtering, sorting and pagination
- Data persistence using browser localStorage
- Basic CSV export

### Out of scope

- Backend API development
- SQL / NoSQL database development
- Real authentication and authorization
- Purchase orders and procurement approval workflows
- Barcode scanner integration
- Multi-warehouse inventory
- Accounting and GST calculations
- Email / SMS notifications
- Cloud hosting or deployment

## 3. Main Features

| Area | What it does |
|---|---|
| Layout (FR-001) | Sidebar, header, page title, navigation with React Router, active item highlighted |
| Dashboard (FR-002) | Total Products, Total Stock Units, Low Stock, Out of Stock, Inventory Value, Today's Transactions, stock-by-category chart, replenishment list |
| Products (FR-003 to FR-005) | List with search, filters, sorting, pagination (5/10/20), Clear Filters; add/edit with validation; details page with latest 10 transactions |
| Categories (FR-006) | Add, edit, list, deactivate; code unique; name unique (case-insensitive); cannot deactivate a category used by an active product |
| Suppliers (FR-007) | Add, edit, list, deactivate; code unique; valid email when entered; inactive supplier cannot be chosen for new products or receipts |
| Stock In (FR-008) | Record received quantity from a supplier; stock increases |
| Stock Out (FR-009) | Record issued quantity; cannot issue more than available |
| Stock Adjustment (FR-010) | Enter actual physical stock; app calculates the difference; reason required; never negative |
| Transaction History (FR-011) | Chronological movements with filters, sorting, pagination; transactions cannot be edited or deleted |
| Low Stock Alerts (FR-012) | Out of Stock / Low Stock / In Stock classification; inactive products excluded from alerts |
| Reports (FR-013) | Current Stock, Stock Movement, Low Stock; filters and CSV export |
| Validation and errors (FR-014) | MUI Alerts, Snackbars and confirmation dialogs |
| Persistence (FR-015) | Data stays after refresh; handles missing or corrupted localStorage safely |

## 4. Key Calculations

- **Available Stock** = Opening Stock + Stock In − Stock Out + Net Adjustments
- **Inventory Value** = Available Stock × product's current Unit Cost
- **Shortfall** = max(0, Reorder Level − Available Stock)

Stock status rules:

- Available Stock = 0 → **Out of Stock**
- Available Stock > 0 and ≤ Reorder Level → **Low Stock**
- Available Stock > Reorder Level → **In Stock**

## 5. Important Business Rules (summary)

- Product Code must be unique and cannot be changed after creation
- Opening Stock is set only when the product is created
- Later quantity changes happen only through Stock In, Stock Out or Stock Adjustment
- Stock can never become negative
- Saved transactions cannot be edited or deleted
- Inactive products cannot be used in new stock transactions
- Deactivating a product keeps its transaction history
- Invalid forms must not create or change any record
- Sample data loads only on the first run
- CSV export must match the filters applied on the report

## 6. Technologies

| Layer | Technology |
|---|---|
| Frontend | React with JavaScript |
| Build tool | Vite |
| UI components | MUI (Material UI) |
| Routing | React Router |
| State management | React Hooks |
| Storage | Browser localStorage |
| Charts | Recharts (free, commercially usable) |
| IDE | VS Code |

## 7. Final Submission Items

Source code (ZIP without node_modules), README, requirement understanding document, navigation flow diagram, component list and data storage explanation, screenshots, test cases with Pass/Fail, known issues, and assumptions document.