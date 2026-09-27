# 🍽️ Smart Serve

**Smart Serve** is a full-stack smart restaurant ordering platform that combines QR-based table verification, digital menus, real-time order management, interactive 3D food visualization, augmented reality, staff dashboards, and restaurant analytics.

> **See it. Choose it. Enjoy it.**

## 🌐 Live Application

https://smart-serve-kb21.vercel.app/

---

## 📌 Project Overview

Smart Serve modernizes the restaurant dining experience.

Customers can scan a restaurant table QR code, verify their table, explore the digital menu, inspect food in 3D or augmented reality, add dishes or discounted combos to their cart, place an order, and track its preparation status in real time.

Restaurant staff use dedicated role-based dashboards for kitchen operations, serving, and management.

---

## ✨ Main Features

### 👤 Customer

- QR-based restaurant/table entry
- Table verification codes
- Real-time menu from Firebase
- Search and category filtering
- Dish details and customization
- Interactive 3D food models
- Augmented Reality food placement
- Discounted food combos
- Shopping cart
- Order placement
- Order confirmation
- Live order status tracking
- Responsive mobile interface

### 👨‍🍳 Kitchen

- Secure Firebase staff login
- Real-time incoming orders
- Accept or reject orders
- Start food preparation
- Mark orders as ready
- Live synchronization with customer devices

### 🧑‍🍽️ Server

- Secure staff login
- View ready orders
- Table information
- Serve/complete orders
- Real-time synchronization

### 👨‍💼 Manager

- Secure Manager authentication
- Restaurant dashboard
- Table management
- Verification-code generation
- QR-code generation
- Menu management
- Staff management
- Orders management
- Restaurant analytics
- 3D Model Studio
- Sales and order statistics

---

## 🔄 Order Workflow

```text
Customer
   │
   │ Places Order
   ▼
Firebase Firestore
   │
   ▼
Kitchen Dashboard
   │
   ├── NEW
   ├── ACCEPTED
   ├── PREPARING
   └── READY
          │
          ▼
    Server Dashboard
          │
          ▼
      COMPLETED
          │
          ▼
Customer Live Status

🪑 Table Verification Flow
Customer scans table QR
        │
        ▼
Smart Serve verification page
        │
        ▼
Customer enters verification code
        │
        ▼
Firestore validates:
Table ID + Verification Code
        │
        ▼
Customer session created
        │
        ▼
Restaurant Menu
🥘 Customer Navigation
The main customer navigation contains:
Menu | Combos | Cart

Menu
Displays the restaurant's available dishes from Firestore.
Combos
Contains discounted meal combinations.
Example:
Biryani Feast
Chicken Biryani + Fresh Lime Soda
Combo Price: ₹349

Veg Delight
Paneer Butter Masala + Garlic Naan
Combo Price: ₹319

Cart
Customers can:
- Increase quantity
- Decrease quantity
- Remove items
- View taxes
- View service charge
- View total amount
- Place an order
🧊 3D Food Visualization
Smart Serve uses GLB models with Google's <model-viewer>.
Customers can:
- Rotate food models
- Zoom
- Reset camera
- Use fullscreen
- Inspect food before ordering
3D assets are stored in:
public/models/

Example:
public/models/masala-dosa.glb

Menu data references the model using:
glbUrl: '/models/masala-dosa.glb'

📱 Augmented Reality
Customers can place supported food models on a real table using AR.
The AR viewer uses:
<model-viewer
  ar
  ar-modes="webxr scene-viewer quick-look"
  ar-scale="fixed"
/>

Supported environments may use:
- WebXR
- Android Scene Viewer
- iOS Quick Look
If AR is unavailable, the normal interactive 3D viewer remains available.
🔥 Firebase
Smart Serve uses Firebase for cloud functionality.
Firestore
Collections include:
restaurants
tables
menuItems
orders
staff

Firebase Authentication
Staff accounts use Email/Password authentication.
Roles:
MANAGER
KITCHEN
SERVER

Customers do not require staff accounts.
🔐 Role-Based Access
Protected application routes include:
Manager
/manager
/manager/menu
/manager/orders
/manager/tables
/manager/staff
/manager/analytics
/manager/models

Kitchen
/kitchen

Server
/server

Staff authentication begins at:
/staff/login

Users are redirected according to the role stored in their Firestore staff profile.
⚡ Real-Time Order Synchronization
Example:
Customer Phone
     │
     │ Place Order
     ▼
Firestore
     │
     ├──────────────► Manager
     │
     ▼
Kitchen
     │
     │ PREPARING
     ▼
Firestore
     │
     ▼
Customer Phone
     │
     │ READY
     ▼
Server

No manual refresh is required for subscribed order views.
🛠️ Technology Stack
Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Lucide React
3D / AR
- Google <model-viewer>
- GLB / glTF
- WebXR
- Android Scene Viewer
- iOS Quick Look
Backend / Cloud
- Firebase
- Cloud Firestore
- Firebase Authentication
Deployment
- Vercel
Version Control
- Git
- GitHub

📂 Project Structure
smart-serve/
│
├── public/
│   ├── images/
│   └── models/
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── customer/
│   │   ├── kitchen/
│   │   ├── manager/
│   │   └── server/
│   │
│   ├── data/
│   ├── services/
│   ├── store/
│   ├── types/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── README.md

⚙️ Local Development
Prerequisites
Install:
- Node.js
- npm
- Git
Clone the repository and enter the project:
git clone YOUR_GITHUB_REPOSITORY_URL
cd smart-serve

Install dependencies:
npm install

Create:
.env

Add:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Do not commit .env.
Start development:
npm run dev

For testing from another device on the same network:
npm run dev -- --host

Production build:
npm run build

🌍 Deployment
The application is deployed using Vercel.
Production:
https://smart-serve-kb21.vercel.app/
The project uses an SPA rewrite through:
vercel.json

so React Router routes work when opened directly or refreshed.
Future updates can be deployed by pushing changes to the connected GitHub repository.
git add .
git commit -m "Describe the update"
git push origin main

Vercel automatically builds and deploys the latest version.
🔒 Security
The application uses:
- Firebase Authentication
- Role-protected React routes
- Firestore security rules
- Staff role documents
- Table ID + verification-code validation
- Environment variables for Firebase configuration
The .env file is excluded from Git.
🚧 Future Improvements
Potential improvements include:
- Accurate real-world AR scale calibration
- Production-quality optimized food GLBs
- Firebase Storage or object storage for media
- Payment integration
- Customer order history
- Restaurant notifications
- Multiple restaurant support
- Advanced sales analytics
- Automated 3D generation pipeline
- More restrictive customer authorization/session security
- Progressive Web App support
🎯 Project Goal
Smart Serve demonstrates how modern web, cloud, realtime database, 3D, and augmented-reality technologies can be combined to create an interactive restaurant ordering experience.
The platform connects customers, kitchen staff, servers, and restaurant managers through one synchronized system.
📄 License
This project was developed for educational and demonstration purposes.

Then save:

```text
Ctrl + S

Run:
git add README.md
git commit -m "Add Smart Serve project documentation"
git push origin main