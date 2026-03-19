# API Documentation: Departmental Store Inventory Management

## Base URL
`http://localhost:5000/api`

## Authentication (`/api/auth`)
- `POST /login`
  - Body: `{ email, password }`
  - Returns: `{ message, token, user }`
- `POST /register`
  - Body: `{ name, email, password, role }`
  - Returns: `{ message, user }`
- `GET /me` (Requires Auth)
  - Returns: `{ user }`

## Dashboard (`/api/dashboard`)
- `GET /stats` (Requires Auth)
  - Returns: `{ totalProducts, lowStockAlerts, lowStockProducts, monthlySales, recentSales }`

## Products (`/api/products`)
- `GET /` (Requires Auth)
- `POST /` (Admin, Manager)
- `PUT /:id` (Admin, Manager)
- `DELETE /:id` (Admin)

## Sales (`/api/sales`)
- `GET /` (Requires Auth)
- `POST /` (Requires Auth) - *Handles stock deduction automatically via transaction.*
  - Body: `{ customerId, payment_method, items: [{ productId, quantity, unit_price }] }`

## Purchases (`/api/purchases`)
- `GET /` (Admin, Manager)
- `POST /` (Admin, Manager) - *Handles stock addition automatically via transaction.*
  - Body: `{ supplierId, productId, quantity, unit_cost }`

## Suppliers (`/api/suppliers`) & Customers (`/api/customers`)
- Standard CRUD matching Products routes.

## Reports (`/api/reports`)
- `GET /inventory` (Admin, Manager) - *Downloads CSV*
- `GET /sales` (Admin, Manager) - *Downloads CSV*
