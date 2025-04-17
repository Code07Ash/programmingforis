# 🛒 Product Table CRUD Web App

This is a full-stack web application that allows users to **Create**, **Read**, **Update**, and **Delete** products from a product table. It is designed using a **vanilla HTML/JavaScript frontend** and a **Node.js + Express backend**, with **SQLite** used as the database engine. This application demonstrates essential CRUD operations in a simple and lightweight inventory management scenario.

---

## 🔧 Technologies Used

### 💻 Frontend
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Fetch API** for communicating with backend APIs

### 🛠️ Backend
- **Node.js**
- **Express.js**
- **SQLite3**

### ⚙️ Dev Tools & Libraries
- **Nodemon** – for automatic server reload during development
- **Body-Parser** – to handle incoming JSON and URL-encoded payloads
- **CORS** – to enable cross-origin requests
- **SQLite3** Node package for database interaction

---

## 📈 Business Requirements

The main objective of this application is to serve as a **simple inventory or product management system** suitable for small businesses, shops, or internal tools. The key functionalities reflect real-world product management needs:

### ✅ Functional Requirements
- Display all products in a tabular format.
- Add new products with a name, price, and quantity.
- Update product details with editable fields.
- Delete a product entry from the table.
- All changes are persisted in a SQLite database.

### 💡 Use Cases
- Small business owners tracking their product inventory.
- Internal teams managing items or materials.
- Developers learning the integration of front-end and back-end with CRUD operations.

---

## 🔗 RESTful API Endpoints

| Method | Endpoint        | Description                |
|--------|------------------|----------------------------|
| GET    | `/products`      | Fetch all products         |
| POST   | `/products`      | Add a new product          |
| PUT    | `/products/:id`  | Update product by ID       |
| DELETE | `/products/:id`  | Delete product by ID       |

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/product-crud-app.git
   cd product-crud-app
