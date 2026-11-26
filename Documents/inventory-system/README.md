# Inventory Management System (React POC)

A frontend-only Proof of Concept for managing products, stock receipts, stock issues, stock adjustments, low-stock alerts and inventory reports. All data is saved in the browser's localStorage. There is no backend or database.

## Features

- Dashboard with six KPI cards, a stock-by-category chart and a replenishment list
- Product management: list with search, filters, sorting and pagination; add, edit and details screens
- Category and supplier management (add, edit, deactivate)
- Stock In, Stock Out and Stock Adjustment with business-rule validation
- Transaction history with filters, sorting and pagination (transactions cannot be edited or deleted)
- Low stock alerts on the dashboard and in a dedicated report
- Three reports (Current Stock, Stock Movement, Low Stock) with filters and CSV export
- Sample data loaded on the first run only
- Classic navy and gold theme built with MUI

## Technologies

| Layer | Technology |
|---|---|
| Frontend | React with JavaScript |
| Build tool | Vite |
| UI components | MUI (Material UI) and MUI icons |
| Routing | React Router |
| State management | React Hooks |
| Storage | Browser localStorage |
| Charts | Recharts |

## Requirements

- Node.js (current LTS version) and npm
- A modern browser such as Chrome or Edge
- VS Code (recommended)

## Installation

1. Open a terminal in the project folder (the folder that contains `package.json`).
2. Install the dependencies:

```
npm install
```

## Running the application

```
npm run dev
```

Open the link shown in the terminal, usually http://localhost:5173/. Keep the terminal open while using the app. Press `Ctrl + C` in the terminal to stop it.

Other commands:

| Command | Purpose |
|---|---|
| `npm run build` | Create a production build in the `dist` folder |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the code with ESLint |

## Data storage

Data is saved in the browser's localStorage under these keys:

| Key | Contents |
|---|---|
| `inventory_products` | Products |
| `inventory_categories` | Categories |
| `inventory_suppliers` | Suppliers |
| `inventory_transactions` | Every stock movement (Opening, Stock In, Stock Out, Adjustment) |
| `inventory_settings` | Application settings (sample data loaded flag) |

On the first run, the app loads 20 products, 5 categories, 5 suppliers and 50 transactions (20 Opening entries and 30 movements). Saved data is never overwritten on later runs.

Available stock is not saved as a number. It is calculated from the transactions: Opening Stock + Stock In - Stock Out + Adjustments.

### Resetting the data

1. Open the app in Chrome and press `F12`.
2. Open the **Application** tab.
3. Click **Clear site data**.
4. Refresh the page. The sample data loads again.

## Screens and routes

| Screen | Route |
|---|---|
| Dashboard | `/` |
| Product List | `/products` |
| Add Product | `/products/new` |
| Product Details | `/products/:id` |
| Edit Product | `/products/:id/edit` |
| Categories | `/categories` |
| Suppliers | `/suppliers` |
| Stock In | `/stock-in` |
| Stock Out | `/stock-out` |
| Stock Adjustment | `/stock-adjustment` |
| Transactions | `/transactions` |
| Reports | `/reports` |

Any other address shows a "Page not found" message inside the normal layout.

## Project structure

```
src/
  components/
    common/     reusable pieces (ActionIcon, ConfirmDialog, StatCard, StockStatusChip, ReportTable)
    layout/     Sidebar and Header
  layouts/      MainLayout (sidebar + header + page)
  pages/        one file per screen
  services/     reading, validating and saving data in localStorage
  utils/        calculation, formatting and CSV helpers
  data/         sample data, constants and the sidebar menu list
  theme.js      colors, fonts and component styles
```

## Main business rules

- Product Code is unique and cannot be changed after creation; Opening Stock is set only at creation
- Stock In increases stock; Stock Out decreases stock and cannot exceed the available stock
- Stock Adjustment requires a reason and can never make stock negative
- Saved transactions cannot be edited or deleted
- Inactive products, categories and suppliers cannot be used in new records
- A category used by an active product cannot be deactivated
- Low Stock means available stock is above 0 and at or below the reorder level

## Project documents

- `requirement-understanding.md`
- `navigation-flow.md`
- `data-model.md`
- `assumptions.md`
- `components-and-storage.md`
- `test-cases.md`
- `known-issues.md`
- `screenshots/` folder

## Security note

localStorage is not suitable for secure, shared production inventory data. This POC is for learning and demonstration only.