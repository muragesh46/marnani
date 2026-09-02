# Marnani — Full-Stack Hospitality & Rental Marketplace

[![Live Demo](https://img.shields.io/badge/Live_Demo-marnani.onrender.com-blue?style=flat-square&logo=render)](https://marnani.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

A production-deployed full-stack web application inspired by Airbnb, engineered with a modular Model-View-Controller (MVC) architecture, secure session-based authentication, cloud media storage, and relational document modeling.

---

## 📌 Overview

Finding and managing vacation rentals requires dependable data persistence, reliable media management, and strict access controls. **Marnani** provides an end-to-end platform where property hosts can publish and manage listings with cloud-optimized photography, and travelers can discover stays, filter by location, and contribute verified community reviews.

---

## ✨ Features

- **Property Lifecycle Management (CRUD):** Hosts can create, view, edit, and delete accommodation listings with detailed descriptions, pricing, and geolocation metadata.
- **Secure Authentication & Role Authorization:** Complete user registration, login/logout, and session persistence powered by Passport.js. Strict authorization middleware ensures only listing/review owners can modify their content.
- **Cloud Media Pipeline:** Direct multi-part image uploads through Multer, stored and transformed using Cloudinary CDN.
- **Community Reviews & Ratings:** 5-star rating system with text reviews, tied directly to authenticated user profiles with relational cascading deletion.
- **Input Validation & Sanitization:** Robust request schema validation using Joi on both client and server boundaries to reject malformed payloads.
- **Flash Notifications:** Real-time feedback alerts for user actions (successful creation, authorization failures, deletions).

---

## 🛠️ Tech Stack

- **Backend / Runtime:** Node.js, Express.js
- **Database & Modeling:** MongoDB, Mongoose ODM
- **Authentication & Security:** Passport.js, Passport-Local, Express-Session, Connect-Mongo
- **Templating & UI:** EJS (Embedded JavaScript), EJS-Mate (layouts & partials), Bootstrap 5, Vanilla CSS
- **Media Storage:** Cloudinary, Multer, Multer-Storage-Cloudinary
- **Validation:** Joi Schema Validation
- **Deployment Platform:** Render

---

## 🏗️ Architecture & How It Works

Marnani is structured using the classical **MVC (Model-View-Controller)** pattern with explicit separation of concerns:

```
├── app.js                 # Application entry point, middleware & route mounting
├── models/                # Mongoose schemas (Listing, Review, User)
├── controllers/           # Business logic handlers (listings, reviews, users)
├── routes/                # RESTful route definitions with authorization guards
├── views/                 # EJS templates, layouts (boilerplate), and partials
├── public/                # Static assets, styling, and client-side scripts
└── config/                # Cloudinary and third-party service configurations
```

### Request Flow
1. **Routing & Authentication:** Requests pass through session verification (`isLoggedIn`) and ownership guards (`isOwner`, `isReviewAuthor`).
2. **Payload Validation:** Inbound POST/PUT requests pass through Joi middleware before touching database controllers.
3. **Media Processing:** Image files are intercepted by Multer, dispatched to Cloudinary, and the secure URL/filename reference is written to the Mongoose document.
4. **Relational Population:** Listing queries dynamically populate linked `Review` and `User` references for composite view rendering.

---

## 📸 Screenshots

> *Recommended UI Captures:*
> 1. **Explore Listings Page:** Grid display of property cards with pricing and locations.
> 2. **Listing Detail View:** Property showcase with image banner, host details, and map view.
> 3. **Review & Rating Section:** Star rating widget and user feedback threads.
> 4. **Add / Edit Listing Form:** Image upload interface and pricing configuration.

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas cluster URI
- Cloudinary Account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/muragesh46/marnani.git
cd marnani
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=8080
ATLASMB=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRAT=your_cloudinary_api_secret
MAP_API_TOKEN=your_map_token_placeholder
USE_LOCAL=false
```

### 4. Seed Database (Optional)
Populate initial mock listings and test records:
```bash
npm run seed
```

### 5. Start the Application
```bash
npm start
```
The server will boot at `http://localhost:8080`.

---

## 🚀 Deployment

The production application is deployed on **Render**:
- Continuous deployment directly tracks the `main` branch.
- Persistent session storage is handled via `connect-mongo` pointing to MongoDB Atlas.

---

## 🔮 Future Improvements

- [ ] Interactive Mapbox integration for dynamic geospatial radius searching.
- [ ] Direct booking calendar with date-range collision prevention.
- [ ] Integration of automated integration tests using Supertest and Jest.
- [ ] Migration from server-rendered EJS to a decoupled React frontend.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
