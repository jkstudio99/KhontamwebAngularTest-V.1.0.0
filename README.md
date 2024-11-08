KhontamwebAngularTest-V.1.0.0
This is the front-end application for KhontamWebAPI, designed for managing product data, including product creation, viewing, updating, and deletion. Built with Angular, the application interacts with the KhontamWebAPI backend and utilizes MySQL for data storage and Cloudinary for media management.

Table of Contents
Project Overview
Features
Prerequisites
Installation
Configuration
Usage
Project Structure
Technologies
License
Project Overview
KhontamwebAngularTest-V.1.0.0 provides a user-friendly interface for administrators to manage product details. The application connects to the backend API, allowing CRUD (Create, Read, Update, Delete) operations on products.

Features
Add Product: Create new products with details like name, category, description, status, and image.
View Products: Display a list of all products or view a specific product by ID.
Update Product: Modify existing product details.
Delete Product: Remove a product from the system.
Image Upload: Upload product images to Cloudinary.
Search & Filter: Search for products by name and filter by category or status.
Prerequisites
Node.js: v14.x or later
Angular CLI: v12.x or later
Cloudinary Account: For image storage and management
Backend API: KhontamWebAPI with MySQL database
Installation
Clone the repository:

bash
คัดลอกโค้ด
git clone https://github.com/yourusername/KhontamwebAngularTest-V.1.0.0.git
cd KhontamwebAngularTest-V.1.0.0
Install dependencies:

bash
คัดลอกโค้ด
npm install
Ensure the KhontamWebAPI backend is running and connected to a MySQL database.

Configuration
API URL: Update the API endpoint in the environment configuration files.

In src/environments/environment.ts:

typescript
คัดลอกโค้ด
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api' // Update with your backend API URL
};
Cloudinary Configuration:

Configure Cloudinary credentials in the Angular service or component responsible for image uploads.
Usage
Run the application:

bash
คัดลอกโค้ด
ng serve
The application will be available at http://localhost:4200.

Navigate:

Access the admin dashboard to manage products.
Product Management:

Use the interface to create, view, update, and delete products.
Upload images directly from the interface, which are saved to Cloudinary.
Project Structure
ruby
คัดลอกโค้ด
src/
├── app/
│   ├── components/           # Reusable components (e.g., product form, product list)
│   ├── services/             # API services for handling requests
│   ├── models/               # Data models/interfaces (e.g., ProductModel)
│   ├── views/                # Views and main pages
│   ├── app.module.ts         # Main app module
│   ├── app.component.ts      # Root component
│   └── ...                   # Other core files
├── assets/                   # Static assets (e.g., images, styles)
├── environments/             # Environment configurations
└── ...                       # Other Angular configuration files
Technologies
Angular: Front-end framework for building user interfaces.
Cloudinary: For managing and storing product images.
MySQL: Relational database used in the backend for data storage.
KhontamWebAPI: RESTful API backend to interact with the MySQL database.
License
This project is licensed under the MIT License. See the LICENSE file for details.
