# 🚀 Jetapult Crypto Dashboard

A full-stack cryptocurrency dashboard application with real-time market data, user authentication, and a chat assistant. Built with React, Node.js, TypeScript, MongoDB, and Redis.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)

## ✨ Features

### Dashboard
- 📊 **Real-time Crypto Data**: View top 10 cryptocurrencies with live prices, market cap, and 24h changes
- 📈 **Historical Charts**: Interactive charts showing 30-day price and market cap trends
- 🔍 **Chat Functionality**: Natural language chat for crypto prices and trends
- ❤️ **Favorites**: Save your favorite cryptocurrencies (requires login)
- 🔄 **Sorting**: Sort by rank, market cap, price, or 24h percentage change

### Authentication
- 🔐 **Google OAuth**: Sign in with your Google account
- 👤 **Guest Mode**: Browse without logging in
- 💾 **User Profiles**: Save preferences and favorites

### Chat Assistant
- 💬 **Natural Language Queries**: Ask questions like "What is the price of Bitcoin?"
- 📊 **Trend Analysis**: Get 7-day, 14-day, or 30-day trend data
- 🤖 **Rule-based Responses**: Intelligent parsing of user queries

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **Redis** - Caching
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Jest** - Testing

## 📁 Project Structure

```
jetapult/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API communication
│   │   ├── context/      # React context
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # HTTP request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── schema/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   ├── cache/        # Redis caching
│   │   └── config/       # Configuration
│   └── package.json
│
├── FRONTEND_ARCHITECTURE.md  # Frontend architecture docs
└── BACKEND_ARCHITECTURE.md   # Backend architecture docs
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or connection string)- **Redis** (optional, for caching)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jetapult
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## 🔧 Environment Variables

### Backend (.env file in `backend/` directory)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/cryptodb

# Redis (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Authentication
JWT_SECRET=your-secret-key-here

# Google OAuth (Optional - for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CoinGecko API (Optional - for external data)
COINGECKO_API_KEY=your-coingecko-api-key
BASE_URL=https://api.coingecko.com/api/v3
```

### Frontend (.env file in `frontend/` directory)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:4000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📡 API Endpoints

### Crypto Endpoints

- `GET /crypto/top?topN=10` - Get top N cryptocurrencies
- `GET /crypto/historic?id=bitcoin` - Get historical data for a crypto
- `GET /crypto/search?query=price of bitcoin` - Search for crypto data
- `GET /crypto/closing-prices-market-cap?id=bitcoin&days=30` - Get closing prices

### Authentication Endpoints

- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/me` - Get current user (requires authentication)
- `POST /auth/favorites` - Add crypto to favorites
- `DELETE /auth/favorites/:cryptoId` - Remove crypto from favorites

### Health Check

- `GET /ping` - Server health check (returns "pong")

## 🏗️ Architecture

This project follows a **clean architecture** pattern with clear separation of concerns:

### Backend Architecture
```
Controllers → Services → Repositories → Database
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic + caching
- **Repositories**: Data access (MongoDB/APIs)
- **Schema**: Database models

### Frontend Architecture
```
Pages → Components → Hooks → Services → Backend API
```

- **Pages**: Route-level components (UI only)
- **Components**: Reusable UI components
- **Hooks**: Business logic & state management
- **Services**: API communication

For detailed architecture documentation, see:
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Key Features Explained

### Caching
- Redis caching is used to reduce database load
- Cache-aside pattern: Check cache first, then database
- Automatic cache invalidation on data updates

### Authentication Flow
1. User clicks "Login with Google"
2. Redirected to Google OAuth
3. Google redirects back with authorization code
4. Backend creates/updates user in database
5. JWT token generated and sent to frontend
6. Token stored in localStorage
7. User can now favorite cryptocurrencies

### Favorites System
- Logged-in users can favorite cryptocurrencies
- Favorites are stored per user in MongoDB
- Heart icon (♥) indicates favorited items
- Favorites persist across sessions

## 🔒 Security

- JWT tokens for authentication
- Environment variables for sensitive data
- CORS configured for frontend-backend communication
- Input validation on API endpoints

## 📚 Additional Resources

- [Frontend Architecture Documentation](./FRONTEND_ARCHITECTURE.md)
- [Backend Architecture Documentation](./BACKEND_ARCHITECTURE.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain separation of concerns (Controllers → Services → Repositories)
3. Use TypeScript for type safety
4. Write tests for new features
5. Keep documentation updated

## 📄 License

ISC

