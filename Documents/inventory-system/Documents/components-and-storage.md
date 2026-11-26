# Components and Data Storage

## 1. Components (20 `.jsx` files)

| Folder | Component | Purpose |
|---|---|---|
| `layouts` | MainLayout | Frame of the app: places the sidebar, header and the current page (`<Outlet />`) |
| `components/layout` | Sidebar | Left menu with the 9 navigation items and icons; the active item is highlighted |
| `components/layout` | Header | Top bar showing the current page title and today's date |
| `components/common` | ActionIcon | Small icon button with a tooltip (View, Edit, Deactivate, Activate) |
| `components/common` | ConfirmDialog | Reusable "Are you sure?" dialog used before deactivating |
| `components/common` | StockStatusChip | Colored In Stock / Low Stock / Out of Stock label |
| `components/common` | StatCard | KPI box used on the dashboard |
| `components/common` | ReportTable | Reusable table with pagination used by the three reports |
| `pages` | Dashboard | INV-01: KPI cards, stock-by-category chart, replenishment list |
| `pages` | Products | INV-02: product list with search, filters, sorting, pagination |
| `pages` | ProductForm | INV-03: add and edit product |
| `pages` | ProductDetails | INV-04: product information, stock, latest 10 transactions |
| `pages` | Categories | INV-05: category management |
| `pages` | Suppliers | INV-06: supplier management |
| `pages` | StockIn | INV-07: receive stock |
| `pages` | StockOut | INV-08: issue stock |
| `pages` | StockAdjustment | INV-09: correct stock differences |
| `pages` | Transactions | INV-10: transaction history |
| `pages` | Reports | INV-11 and INV-12: Current Stock, Stock Movement and Low Stock reports with CSV export |
| `pages` | NotFound | Friendly "Page not found" message |

`App.jsx` defines the routes and the theme provider, and `main.jsx` starts the app inside the router.

## 2. Non-component files

| Folder | File | Purpose |
|---|---|---|
| `src` | theme.js | Colors, fonts and default styles of MUI components |
| `data` | sampleData.js | Sample categories, suppliers, products and movements (first run only) |
| `data` | constants.js | Units list, stock statuses, transaction types |
| `data` | navItems.js | The sidebar menu list with icons |
| `services` | storageService.js | Safe read and write of localStorage; loads sample data on the first run |
| `services` | categoryService.js | Category rules (unique code and name, cannot deactivate if used) |
| `services` | supplierService.js | Supplier rules (unique code, valid email) |
| `services` | productService.js | Product rules; creates the Opening transaction when a product is added |
| `services` | transactionService.js | Stock In, Stock Out and Adjustment rules |
| `utils` | inventoryUtils.js | Available stock, stock status, inventory value, shortfall, transaction id |
| `utils` | formatters.js | Money and date display, local date key |
| `utils` | csvUtils.js | Builds and downloads CSV files in the browser |

## 3. How data flows

```
Page (screen)  →  Service (rules + saving)  →  localStorage
      ↑                                              |
      └────────────── reads data back ───────────────┘
```

- A page collects what the user types and shows messages. It does not decide business rules.
- A service validates the data and saves it. If anything is invalid, nothing is saved.
- Utility functions do the calculations, so every screen shows the same numbers.

## 4. Data storage

| localStorage key | Contents |
|---|---|
| `inventory_products` | List of products |
| `inventory_categories` | List of categories |
| `inventory_suppliers` | List of suppliers |
| `inventory_transactions` | List of all stock movements. Adjustments are stored here too. |
| `inventory_settings` | Application settings (sample data loaded flag) |

### Relationships

- A product refers to its category with `categoryId` and to its default supplier with `supplierId`.
- A transaction refers to its product with `productId`. A Stock In transaction also refers to a supplier with `supplierId`.
- Names are not copied. Screens look names up by id, so renaming a category shows the new name everywhere.

### How stock is kept consistent

- The product record holds `openingStock`, but available stock is **not** stored.
- Every product gets an `Opening` transaction when it is created, so available stock is always the sum of that product's `quantityChange` values.
- Stock In adds a positive change, Stock Out a negative change, and an Adjustment the difference between actual and system stock.
- Each transaction also stores `balanceAfter`, calculated when it is saved.
- Transactions are only ever added to the list. They are never edited or deleted.

### First run and errors

- Sample data is loaded only if none of the four data keys exist, so saved records are never overwritten.
- If saved data is unreadable (corrupted), the app does not overwrite it. Saving is blocked with a message.
- If the browser refuses to save (for example, storage is full), the user sees an error message and the previous data stays unchanged.