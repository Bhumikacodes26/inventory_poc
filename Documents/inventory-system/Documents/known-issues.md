# Known Issues and Incomplete Features

Tested by: ____________________    Date: ____________________

## Test result summary

All 30 test cases in `test-cases.md` were run. 30 passed and 0 failed.

## Issues found during testing

| ID | Test | What happened | Status |
|---|---|---|---|
| - | - | No failed tests were found during testing. | Closed |

## Known limitations

These are not defects. They come from the POC scope, the specification, or the choice of localStorage.

| ID | Limitation | Why it exists |
|---|---|---|
| KI-01 | Data exists only in one browser. Clearing browser data deletes it, and other computers or browsers do not see it. | The POC uses localStorage and has no backend, as the specification requires. |
| KI-02 | A page reads the data when it opens. If the app is open in two tabs, changes made in one tab appear in the other only after a refresh or reopening the page. | The pages load from localStorage once; there is no live sync between tabs. |
| KI-03 | Two tabs saving at the same moment could create the same transaction id. | localStorage has no locking, and ids are made from the highest existing number. |
| KI-04 | When saved data is corrupted, list pages show empty tables without a warning banner. Saving is blocked with a message, and the saved value is not overwritten. | Warning banners on every page were not part of the POC scope. |
| KI-05 | "Today's Transactions" shows 0 when the app is first opened, because the sample transactions are dated October and November 2026. | The sample data uses fixed dates. |
| KI-06 | Editing a product's Unit Cost changes the inventory value of all its existing stock. | The specification says inventory value uses the current master Unit Cost, not FIFO or weighted average. |
| KI-07 | The sidebar is always visible, so the layout is not designed for phone-sized screens. | The specification requires desktop and tablet screens only. |
| KI-08 | There are no automated tests. All testing is manual (see `test-cases.md`). | Not required for the POC. |
| KI-09 | Deactivating a category does not change products that already use it (only active products block the deactivation). Deactivating a supplier has no restriction. | These are the rules in the specification. |
| KI-10 | There is no Delete action for products, categories or suppliers. They can only be deactivated. | Required by BR-018 and the Deactivate action in the specification. |

## Incomplete features

None of the required screens (INV-01 to INV-12) or functional requirements (FR-001 to FR-015) is intentionally left out.

Items outside the specification are not built: authentication, backend, purchase orders, barcode scanning, multiple warehouses, GST, notifications and deployment.