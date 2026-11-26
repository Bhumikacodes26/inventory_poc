// Sample data used only on the very first run of the app.

export const OPENING_DATE = '2026-10-01T09:00:00.000Z'

export const sampleCategories = [
  { id: 'cat-1', code: 'CAT-LAP', name: 'Laptops', description: 'Laptop computers', status: 'Active' },
  { id: 'cat-2', code: 'CAT-PER', name: 'Peripherals', description: 'Keyboards, mice and headsets', status: 'Active' },
  { id: 'cat-3', code: 'CAT-MON', name: 'Monitors', description: 'Desktop monitors', status: 'Active' },
  { id: 'cat-4', code: 'CAT-PRN', name: 'Printers', description: 'Printers and toner', status: 'Active' },
  { id: 'cat-5', code: 'CAT-NET', name: 'Network and Office', description: 'Network accessories and office supplies', status: 'Active' },
]

export const sampleSuppliers = [
  { id: 'sup-1', code: 'SUP-001', name: 'TechWorld Distributors', contactPerson: 'Arun Mehta', email: 'arun@techworld.example', phone: '9876500001', status: 'Active' },
  { id: 'sup-2', code: 'SUP-002', name: 'Digital Source Pvt Ltd', contactPerson: 'Priya Nair', email: 'priya@digitalsource.example', phone: '9876500002', status: 'Active' },
  { id: 'sup-3', code: 'SUP-003', name: 'OfficeMart', contactPerson: 'Rahul Sen', email: 'rahul@officemart.example', phone: '9876500003', status: 'Active' },
  { id: 'sup-4', code: 'SUP-004', name: 'NetLink Traders', contactPerson: 'Kavya Reddy', email: 'kavya@netlink.example', phone: '9876500004', status: 'Active' },
  { id: 'sup-5', code: 'SUP-005', name: 'PrintPro Supplies', contactPerson: 'Imran Khan', email: 'imran@printpro.example', phone: '9876500005', status: 'Active' },
]

export const sampleProducts = [
  { id: 'prod-1', code: 'P-1001', name: 'Dell Latitude 5440 Laptop', categoryId: 'cat-1', supplierId: 'sup-1', description: '', unit: 'Pieces', unitCost: 65000, openingStock: 15, reorderLevel: 5, status: 'Active' },
  { id: 'prod-2', code: 'P-1002', name: 'HP ProBook 450 Laptop', categoryId: 'cat-1', supplierId: 'sup-1', description: '', unit: 'Pieces', unitCost: 58000, openingStock: 12, reorderLevel: 5, status: 'Active' },
  { id: 'prod-3', code: 'P-1003', name: 'Lenovo ThinkPad E14 Laptop', categoryId: 'cat-1', supplierId: 'sup-2', description: '', unit: 'Pieces', unitCost: 62000, openingStock: 8, reorderLevel: 4, status: 'Active' },
  { id: 'prod-4', code: 'P-2001', name: 'Logitech K120 Keyboard', categoryId: 'cat-2', supplierId: 'sup-2', description: '', unit: 'Pieces', unitCost: 650, openingStock: 60, reorderLevel: 20, status: 'Active' },
  { id: 'prod-5', code: 'P-2002', name: 'Dell Wireless Keyboard KM636', categoryId: 'cat-2', supplierId: 'sup-2', description: '', unit: 'Pieces', unitCost: 1800, openingStock: 30, reorderLevel: 10, status: 'Active' },
  { id: 'prod-6', code: 'P-2003', name: 'Logitech M185 Wireless Mouse', categoryId: 'cat-2', supplierId: 'sup-2', description: '', unit: 'Pieces', unitCost: 700, openingStock: 55, reorderLevel: 20, status: 'Active' },
  { id: 'prod-7', code: 'P-2004', name: 'HP USB Optical Mouse', categoryId: 'cat-2', supplierId: 'sup-3', description: '', unit: 'Pieces', unitCost: 350, openingStock: 40, reorderLevel: 15, status: 'Active' },
  { id: 'prod-8', code: 'P-2005', name: 'USB Headset with Microphone', categoryId: 'cat-2', supplierId: 'sup-3', description: '', unit: 'Pieces', unitCost: 900, openingStock: 25, reorderLevel: 10, status: 'Active' },
  { id: 'prod-9', code: 'P-3001', name: 'Dell 24 inch Monitor', categoryId: 'cat-3', supplierId: 'sup-1', description: '', unit: 'Pieces', unitCost: 9500, openingStock: 20, reorderLevel: 6, status: 'Active' },
  { id: 'prod-10', code: 'P-3002', name: 'LG 27 inch Monitor', categoryId: 'cat-3', supplierId: 'sup-1', description: '', unit: 'Pieces', unitCost: 14500, openingStock: 10, reorderLevel: 4, status: 'Active' },
  { id: 'prod-11', code: 'P-3003', name: 'HP 22 inch Monitor', categoryId: 'cat-3', supplierId: 'sup-3', description: '', unit: 'Pieces', unitCost: 7200, openingStock: 14, reorderLevel: 5, status: 'Active' },
  { id: 'prod-12', code: 'P-4001', name: 'HP LaserJet Pro Printer', categoryId: 'cat-4', supplierId: 'sup-5', description: '', unit: 'Pieces', unitCost: 18500, openingStock: 6, reorderLevel: 3, status: 'Active' },
  { id: 'prod-13', code: 'P-4002', name: 'Canon Inkjet Printer', categoryId: 'cat-4', supplierId: 'sup-5', description: '', unit: 'Pieces', unitCost: 8200, openingStock: 5, reorderLevel: 3, status: 'Active' },
  { id: 'prod-14', code: 'P-4003', name: 'Black Toner Cartridge', categoryId: 'cat-4', supplierId: 'sup-5', description: '', unit: 'Boxes', unitCost: 3200, openingStock: 18, reorderLevel: 8, status: 'Active' },
  { id: 'prod-15', code: 'P-5001', name: 'CAT6 Network Cable 305m', categoryId: 'cat-5', supplierId: 'sup-4', description: '', unit: 'Boxes', unitCost: 7800, openingStock: 10, reorderLevel: 3, status: 'Active' },
  { id: 'prod-16', code: 'P-5002', name: '24-Port Network Switch', categoryId: 'cat-5', supplierId: 'sup-4', description: '', unit: 'Pieces', unitCost: 12500, openingStock: 6, reorderLevel: 2, status: 'Active' },
  { id: 'prod-17', code: 'P-5003', name: 'WiFi Router', categoryId: 'cat-5', supplierId: 'sup-4', description: '', unit: 'Pieces', unitCost: 3400, openingStock: 15, reorderLevel: 5, status: 'Active' },
  { id: 'prod-18', code: 'P-5004', name: 'A4 Paper Box (5 reams)', categoryId: 'cat-5', supplierId: 'sup-3', description: '', unit: 'Boxes', unitCost: 1200, openingStock: 50, reorderLevel: 20, status: 'Active' },
  { id: 'prod-19', code: 'P-5005', name: 'Ballpoint Pen Pack', categoryId: 'cat-5', supplierId: 'sup-3', description: '', unit: 'Packs', unitCost: 120, openingStock: 100, reorderLevel: 30, status: 'Active' },
  { id: 'prod-20', code: 'P-5006', name: 'VGA Cable 1.5m', categoryId: 'cat-5', supplierId: 'sup-4', description: '', unit: 'Pieces', unitCost: 150, openingStock: 20, reorderLevel: 10, status: 'Inactive' },
]

// quantityChange: positive = stock increases, negative = stock decreases.
// balanceAfter is NOT written here. The app calculates it (see storageService.js).
export const sampleMovements = [
  { productId: 'prod-1', type: 'Stock Out', quantityChange: -4, date: '2026-10-05T10:00:00.000Z', issuedTo: 'Ravi Kumar', department: 'IT', purpose: 'New joiner laptops', remarks: '' },
  { productId: 'prod-4', type: 'Stock Out', quantityChange: -25, date: '2026-10-06T10:00:00.000Z', issuedTo: 'Sneha Rao', department: 'Admin', purpose: 'Keyboard replacement', remarks: '' },
  { productId: 'prod-2', type: 'Stock In', quantityChange: 10, date: '2026-10-08T10:00:00.000Z', supplierId: 'sup-1', unitCost: 58000, referenceNumber: 'INV-2026-101', remarks: 'Regular purchase' },
  { productId: 'prod-9', type: 'Stock Out', quantityChange: -8, date: '2026-10-09T10:00:00.000Z', issuedTo: 'Kiran Das', department: 'Finance', purpose: 'New desk setup', remarks: '' },
  { productId: 'prod-6', type: 'Stock In', quantityChange: 30, date: '2026-10-10T10:00:00.000Z', supplierId: 'sup-2', unitCost: 700, referenceNumber: 'INV-2026-102', remarks: 'Regular purchase' },
  { productId: 'prod-3', type: 'Stock Out', quantityChange: -8, date: '2026-10-12T10:00:00.000Z', issuedTo: 'Meera Nair', department: 'HR', purpose: 'Batch of new hires', remarks: '' },
  { productId: 'prod-12', type: 'Stock Out', quantityChange: -2, date: '2026-10-14T10:00:00.000Z', issuedTo: 'Anil Verma', department: 'Admin', purpose: 'Floor printers', remarks: '' },
  { productId: 'prod-5', type: 'Adjustment', quantityChange: -2, date: '2026-10-15T10:00:00.000Z', reason: 'Damaged during storage', remarks: '' },
  { productId: 'prod-14', type: 'Stock Out', quantityChange: -12, date: '2026-10-16T10:00:00.000Z', issuedTo: 'Sneha Rao', department: 'Admin', purpose: 'Monthly printing', remarks: '' },
  { productId: 'prod-20', type: 'Stock Out', quantityChange: -5, date: '2026-10-17T10:00:00.000Z', issuedTo: 'Ravi Kumar', department: 'IT', purpose: 'Server room cabling', remarks: '' },
  { productId: 'prod-7', type: 'Stock Out', quantityChange: -30, date: '2026-10-18T10:00:00.000Z', issuedTo: 'Pooja Shah', department: 'Sales', purpose: 'Sales team mice', remarks: '' },
  { productId: 'prod-1', type: 'Stock Out', quantityChange: -6, date: '2026-10-20T10:00:00.000Z', issuedTo: 'Nikhil Joshi', department: 'Engineering', purpose: 'Developer laptops', remarks: '' },
  { productId: 'prod-17', type: 'Stock Out', quantityChange: -4, date: '2026-10-21T10:00:00.000Z', issuedTo: 'Ravi Kumar', department: 'IT', purpose: 'Branch office WiFi', remarks: '' },
  { productId: 'prod-8', type: 'Stock Out', quantityChange: -5, date: '2026-10-22T10:00:00.000Z', issuedTo: 'Divya Iyer', department: 'Support', purpose: 'Support team headsets', remarks: '' },
  { productId: 'prod-18', type: 'Stock Out', quantityChange: -35, date: '2026-10-24T10:00:00.000Z', issuedTo: 'Sneha Rao', department: 'Admin', purpose: 'Quarterly paper stock', remarks: '' },
  { productId: 'prod-6', type: 'Stock Out', quantityChange: -15, date: '2026-10-25T10:00:00.000Z', issuedTo: 'Pooja Shah', department: 'Sales', purpose: 'Sales team mice', remarks: '' },
  { productId: 'prod-9', type: 'Stock In', quantityChange: 15, date: '2026-10-28T10:00:00.000Z', supplierId: 'sup-1', unitCost: 9500, referenceNumber: 'INV-2026-103', remarks: 'Regular purchase' },
  { productId: 'prod-13', type: 'Stock Out', quantityChange: -5, date: '2026-10-30T10:00:00.000Z', issuedTo: 'Anil Verma', department: 'Admin', purpose: 'Branch printers', remarks: '' },
  { productId: 'prod-19', type: 'Stock Out', quantityChange: -40, date: '2026-11-01T10:00:00.000Z', issuedTo: 'Sneha Rao', department: 'Admin', purpose: 'Stationery issue', remarks: '' },
  { productId: 'prod-4', type: 'Stock Out', quantityChange: -20, date: '2026-11-02T10:00:00.000Z', issuedTo: 'Divya Iyer', department: 'Support', purpose: 'Support desk keyboards', remarks: '' },
  { productId: 'prod-10', type: 'Stock Out', quantityChange: -6, date: '2026-11-03T10:00:00.000Z', issuedTo: 'Kiran Das', department: 'Finance', purpose: 'Finance team monitors', remarks: '' },
  { productId: 'prod-11', type: 'Adjustment', quantityChange: -3, date: '2026-11-05T10:00:00.000Z', reason: 'Physical count mismatch', remarks: '' },
  { productId: 'prod-15', type: 'Stock Out', quantityChange: -3, date: '2026-11-08T10:00:00.000Z', issuedTo: 'Ravi Kumar', department: 'IT', purpose: 'New office cabling', remarks: '' },
  { productId: 'prod-12', type: 'Stock Out', quantityChange: -1, date: '2026-11-10T10:00:00.000Z', issuedTo: 'Meera Nair', department: 'HR', purpose: 'HR office printer', remarks: '' },
  { productId: 'prod-16', type: 'Stock Out', quantityChange: -2, date: '2026-11-11T10:00:00.000Z', issuedTo: 'Ravi Kumar', department: 'IT', purpose: 'Server rack', remarks: '' },
  { productId: 'prod-14', type: 'Stock In', quantityChange: 20, date: '2026-11-12T10:00:00.000Z', supplierId: 'sup-5', unitCost: 3200, referenceNumber: 'INV-2026-104', remarks: 'Regular purchase' },
  { productId: 'prod-18', type: 'Stock In', quantityChange: 40, date: '2026-11-15T10:00:00.000Z', supplierId: 'sup-3', unitCost: 1200, referenceNumber: 'INV-2026-105', remarks: 'Regular purchase' },
  { productId: 'prod-19', type: 'Adjustment', quantityChange: -5, date: '2026-11-18T10:00:00.000Z', reason: 'Stock count correction', remarks: '' },
  { productId: 'prod-17', type: 'Stock In', quantityChange: 10, date: '2026-11-19T10:00:00.000Z', supplierId: 'sup-4', unitCost: 3400, referenceNumber: 'INV-2026-106', remarks: 'Regular purchase' },
  { productId: 'prod-2', type: 'Stock Out', quantityChange: -5, date: '2026-11-20T10:00:00.000Z', issuedTo: 'Nikhil Joshi', department: 'Engineering', purpose: 'Replacement laptops', remarks: '' },
]