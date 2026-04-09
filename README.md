# LensLink

Photography & Videography Service Management System

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT

## Project Structure

```
LensLink/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express backend
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API routes
│   ├── controllers/ # Business logic
│   ├── middleware/  # Custom middleware
│   ├── config/      # Configuration
│   └── package.json
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## Features
- Service listing and browsing
- Online booking system
- Admin dashboard for managing bookings
- Portfolio showcase
- JWT authentication
- MongoDB database

## Future Enhancements
- Online payments (bKash/Nagad)
- Live chat
- Review system
