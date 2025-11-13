# Backend Architecture

## 📁 Directory Structure

```
backend/src/
│
├── main.ts                        # Entry point - connects DB, starts server
├── server.ts                      # Express server setup
│
├── controllers/                   # API endpoints (routes)
│   ├── index.ts                   # Route aggregator
│   ├── auth.controller.ts         # Authentication endpoints
│   └── crypto.controller.ts      # Crypto data endpoints
│
├── services/                      # Business logic
│   ├── auth.service.ts            # Auth logic + caching
│   ├── crypto.service.ts          # Crypto logic + caching
│   ├── coingecko.service.ts      # CoinGecko sync logic
│   └── data-refresh.service.ts   # Data initialization & cron jobs
│
├── repositories/                  # Database operations
│   ├── auth.repository.ts         # User database queries
│   ├── crypto.repository.ts      # Crypto database queries
│   └── coingecko.repository.ts   # CoinGecko API calls
│
├── schema/                        # Database models
│   ├── user.schema.ts
│   ├── crypto.schema.ts
│   └── crypto-historic-data.schema.ts
│
├── middleware/                    # Express middleware
│   └── is-authenticated.ts        # JWT authentication
│
├── config/                        # Configuration
│   └── passport.ts                # Google OAuth setup
│
├── cache/                         # Redis caching
│   └── redis-client.ts
│
└── helpers/                       # Utilities
    └── connect-db.ts              # MongoDB connection
```

## 🔄 Architecture Flow

```
HTTP Request
    ↓
Controllers (HTTP handling)
    ↓
Services (Business logic + Caching)
    ↓
Repositories (Database/API access)
    ↓
Database/External APIs
```

## 📡 API Endpoints

### Crypto Endpoints

**GET `/crypto/top?topN=10`**
- Returns top N cryptocurrencies (1-10)
- Includes: price, market cap, volume, 24h change
- Cached in Redis

**GET `/crypto/historic?id=bitcoin`**
- Returns 30-day historic data for a crypto
- Includes: prices, market caps, volumes arrays
- Cached in Redis

**GET `/crypto/closing-prices-market-cap?id=bitcoin&days=7`**
- Returns closing prices and market cap for last N days (1-30)
- Extracts latest value per day from historic data
- Cached in Redis

**GET `/crypto/search?query=What is the price of Bitcoin`**
- Rule-based query parser
- Detects crypto name and query type (price, trend, market cap, etc.)
- Returns crypto object or historic data based on query
- Cached in Redis

### Auth Endpoints

**GET `/auth/google`**
- Initiates Google OAuth login
- Redirects to Google authentication

**GET `/auth/google/callback`**
- Google OAuth callback handler
- Creates/updates user in database
- Generates JWT token
- Redirects to frontend with token

**GET `/auth/me`**
- Returns current user data
- Requires JWT authentication
- Returns user profile with favorites

**POST `/auth/favorites`**
- Adds crypto to user's favorites
- Requires JWT authentication
- Body: `{ cryptoId: "bitcoin" }`

**DELETE `/auth/favorites/:cryptoId`**
- Removes crypto from user's favorites
- Requires JWT authentication

### Health Check

**GET `/ping`**
- Server health check
- Returns: "pong"

## 🔑 Key Concepts

**Controllers** → Handle HTTP requests/responses, validate input, call services

**Services** → Business logic, caching (Redis), orchestrate operations

**Repositories** → Direct database queries and external API calls

**Caching** → Redis cache-aside pattern - check cache first, then database

**Authentication** → JWT tokens, Google OAuth for login

## 🛠️ Technology Stack

- Node.js + Express.js
- TypeScript
- MongoDB (Mongoose)
- Redis (ioredis)
- Passport.js + JWT
- Jest (testing)
- node-cron (scheduled tasks)
