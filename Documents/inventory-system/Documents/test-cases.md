# Test Cases — Inventory Management System

Tested by: _____BHUMIKA_______________    Date: __25|11|2026__________________

## How the tests were run

1. The data was reset before starting: Application tab → **Clear site data**, then refresh the page.
2. The tests were run in the order below, because some tests use the result of earlier tests.
3. Each test has an actual result and a Pass or Fail result.

Sample products used below: P-1001 Dell Latitude (stock 5, reorder 5), P-1002 HP ProBook (stock 17, reorder 5), P-2001 Logitech K120 Keyboard (stock 15, reorder 20).

## Acceptance criteria tests

| Test | AC | Scenario | Steps | Expected result | Actual result | Pass/Fail |
|---|---|---|---|---|---|---|
| TC-01 | AC-01 | First run loads sample data | Clear site data, refresh, open Products, Categories, Suppliers, Transactions | 20 products, 5 categories, 5 suppliers and 50 transactions are shown | As expected | Pass |
| TC-02 | AC-02 | Add a valid product | Products → Add Product. Code `P-9001`, name `Test Item`, any category and supplier, unit Pieces, unit cost 100, opening stock 10, reorder level 3. Save | Product appears in the list with stock 10 and a success message | As expected | Pass |
| TC-03 | AC-03 | Duplicate product code | Add a product with code `P-1001` | Error "This product code already exists"; nothing is saved | As expected | Pass |
| TC-04 | AC-04 | Required fields | Open Add Product, leave everything empty, Save | Red errors under the required fields; nothing is saved | As expected | Pass |
| TC-05 | AC-05 | Edit a product | Edit `P-9001` (pencil icon), change the name to `Test Item 2`, save | List shows the new name; Product Code and Opening Stock are disabled in the form | As expected | Pass |
| TC-06 | AC-06 | Create a category | Categories → Add Category, code `CAT-CAB`, name `Cables`, save. Open Add Product | Category appears in the table and in the Category dropdown | As expected | Pass |
| TC-07 | AC-07 | Create a supplier | Suppliers → Add Supplier, code `SUP-006`, name `Test Supplier`, save. Open Stock In | Supplier appears in the table and in the Supplier dropdown | As expected | Pass |
| TC-08 | AC-08 | Receive 10 units | Stock In → `P-9001`, supplier `Test Supplier`, quantity 10, unit cost 100, Receive Stock | Stock of `P-9001` goes from 10 to 20; a transaction id is shown in the message | As expected | Pass |
| TC-09 | AC-09 | Issue 5 units | Stock Out → `P-9001`, quantity 5, Issued To, Department, Purpose filled, Issue Stock | Stock of `P-9001` goes from 20 to 15 | As expected | Pass |
| TC-10 | AC-10 | Issue more than available | Stock Out → `P-9001`, quantity 100 | Error saying only 15 units are available; stock stays 15 | As expected | Pass |
| TC-11 | AC-11 | Zero or negative quantity | Stock Out with quantity 0, then -1. Stock In with quantity 0 | Validation error each time; nothing is saved | As expected | Pass |
| TC-12 | AC-12 | Adjust to physical quantity | Stock Adjustment → `P-2001`, actual stock 12, reason `Count check`, save | Helper text showed "Adjustment: -3"; stock of `P-2001` is now 12; an Adjustment of -3 is in the history. Saving without a reason shows an error | As expected | Pass |
| TC-13 | AC-13 | Stock reaches zero | Stock Out → `P-1001`, quantity 5 | Stock is 0 and status is Out of Stock | As expected | Pass |
| TC-14 | AC-14 | Stock below reorder level | Stock Out → `P-1002`, quantity 13 | Stock is 4 (reorder level 5) and status is Low Stock; it appears in the Dashboard replenishment list | As expected | Pass |
| TC-15 | AC-15 | Dashboard recalculates | Note Total Stock Units and Today's Transactions on the Dashboard. Receive 10 units of any product on Stock In. Open the Dashboard | Total Stock Units is 10 higher; Today's Transactions is 1 higher | As expected | Pass |
| TC-16 | AC-16 | View transaction history | Transactions → filter Product `P-1001` | Rows: Opening +15 (balance 15), Stock Out -4 (11), Stock Out -6 (5), Stock Out -5 (0) | As expected | Pass |
| TC-17 | AC-17 | Product filters | Products → search `mouse`; then clear and choose Category `Monitors`; then Stock Status `Out of Stock`; then Clear Filters | `mouse` gives 2 products; Monitors gives 3 products; Out of Stock shows only products with stock 0; Clear Filters shows all | As expected | Pass |
| TC-18 | AC-18 | Pagination size | Products → set rows per page to 5, then 10, then 20 | 5 rows, 10 rows, then all rows; the count text is correct | As expected | Pass |
| TC-19 | AC-19 | Export stock report | Reports → Current Stock → Export CSV. Open the file | CSV has a header and one row per product shown on screen; values match the screen | As expected | Pass |
| TC-20 | AC-20 | Refresh | Press F5 on Products, Transactions and Dashboard | All saved records and stock values are still there | As expected | Pass |
| TC-21 | AC-21 | Deactivate product | Products → click the Deactivate icon (block symbol) on `P-9001` and confirm. Open Stock In, Stock Out and Stock Adjustment | Status shows Inactive; `P-9001` is not in any of the three dropdowns; its history is still in Transactions | As expected | Pass |
| TC-22 | AC-22 | Nonexistent product | Open `localhost:5173/products/abc` | A "Product not found" message with a button back to Products | As expected | Pass |
| TC-23 | AC-23 | Historical transaction cannot change | Open Transactions and Product Details | No Edit or Delete button exists for any transaction | As expected | Pass |
| TC-24 | AC-24 | Deactivate category in use | Categories → click the Deactivate icon on `Laptops` and confirm | Error saying the category is used by active products; it stays Active | As expected | Pass |
| TC-25 | AC-25 | Filtered export matches | Reports → Stock Movement → Product `P-1001`, Type `Stock Out` → Export CSV | CSV contains exactly the rows shown on screen after filtering | As expected | Pass |

## Extra tests

| Test | Scenario | Steps | Expected result | Actual result | Pass/Fail |
|---|---|---|---|---|---|
| TC-26 | Corrupted data | In the Console run `localStorage.setItem('inventory_categories', 'abc')`, refresh, then try to add a category | App does not crash; saving is blocked with a message; the corrupted value is not overwritten. Reset with Clear site data afterwards | As expected | Pass |
| TC-27 | Performance | Add 85 extra products and 535 extra transactions with a console script (test data only, not part of the project code), refresh, open Products, Transactions and Reports | At least 100 products and 500 transactions; pages stay responsive | As expected | Pass |
| TC-28 | Invalid supplier email | Suppliers → Add Supplier with email `abc` | Email error; a blank email is allowed | As expected | Pass |
| TC-29 | Inactive supplier on receipt | Deactivate `Test Supplier`, open Stock In | `Test Supplier` is not in the Supplier dropdown | As expected | Pass |
| TC-30 | Sample data not reloaded | Add a product, refresh the page several times | Sample data is not loaded again; your product is still there | As expected | Pass |

## Summary

| Total tests | Passed | Failed |
|---|---|---|
| 30 | 30 | 0 |