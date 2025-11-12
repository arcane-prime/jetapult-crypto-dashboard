# Backend Architecture Diagram

## 📁 Directory Structure

```
backend/src/
│
├── 📄 main.ts                        # Application Entry Point
│   └── Connects DB, starts server, initializes cron jobs
│
├── 📄 server.ts                      # Express Server Setup
│   └── Creates Express app, configures middleware, mounts routes
│
├── 📁 controllers/                    # HTTP Request Handlers (Routes)
│   ├── index.ts                      # Route aggregator
│   ├── auth.controller.ts            # Authentication endpoints
│   └── crypto.controller.ts         # Crypto data endpoints
│
├── 📁 services/                      # Business Logic Layer
│   ├── auth.service.ts               # Auth business logic + caching
│   ├── crypto.service.ts            # Crypto business logic + caching
│   └── coingecko.service.ts         # CoinGecko sync logic
│
├── 📁 repositories/                  # Data Access Layer
│   ├── auth.repository.ts            # User database operations
│   ├── crypto.repository.ts         # Crypto database operations
│   └── coingecko.repository.ts      # CoinGecko API calls
│
├── 📁 schema/                        # Database Schemas (Models)
│   ├── user.schema.ts               # User Mongoose schema
│   ├── crypto.schema.ts             # Crypto Mongoose schema
│   └── crypto-historic-data.schema.ts
│
├── 📁 middleware/                    # Express Middleware
│   └── is-authenticated.ts          # JWT authentication middleware
│
├── 📁 config/                        # Configuration Files
│   └── passport.ts                   # Passport.js OAuth strategy
│
├── 📁 cache/                         # Caching Layer
│   └── redis-client.ts              # Redis client & cache utilities
│
├── 📁 helpers/                       # Utility Functions
│   └── connect-db.ts                # Database connection helper
│
└── 📁 __tests__/                     # Unit Tests
    └── server.test.ts               # API endpoint tests
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST                              │
│              GET /crypto/top?topN=10                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLERS LAYER                         │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ auth.        │  │ crypto.      │                        │
│  │ controller   │  │ controller   │                        │
│  └──────┬───────┘  └──────┬───────┘                        │
│         │                 │                                  │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (HTTP Handling - Request/Response)                   │
│         - Validate input                                     │
│         - Call services                                       │
│         - Return JSON response                                │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ auth.service│  │ crypto.       │  │ coingecko.   │     │
│  │    .ts      │  │ service.ts   │  │ service.ts   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (Business Logic + Caching)                           │
│         - Check Redis cache                                  │
│         - Apply business rules                                │
│         - Orchestrate operations                              │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORIES LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ auth.        │  │ crypto.       │  │ coingecko.   │     │
│  │ repository   │  │ repository   │  │ repository   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (Data Access - Database/API)                         │
│         - MongoDB queries                                    │
│         - External API calls                                 │
│         - Data transformation                                │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  MongoDB     │  │  Redis       │  │  CoinGecko   │     │
│  │  Database    │  │  Cache       │  │  API         │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Layer Responsibilities

### 1. **Controllers Layer** (`controllers/`)
- **Purpose**: HTTP request/response handling
- **Responsibility**: 
  - Define API endpoints (routes)
  - Validate request parameters
  - Call service layer
  - Return HTTP responses
  - Handle errors
- **No Business Logic**: Only HTTP handling

### 2. **Services Layer** (`services/`)
- **Purpose**: Business logic & orchestration
- **Responsibility**:
  - Implement business rules
  - Handle caching (Redis)
  - Orchestrate multiple repository calls
  - Data transformation
  - Error handling
- **No Direct DB Access**: Calls repositories

### 3. **Repositories Layer** (`repositories/`)
- **Purpose**: Data access abstraction
- **Responsibility**:
  - Direct database operations (MongoDB)
  - External API calls (CoinGecko)
  - Data queries & mutations
  - Data mapping/transformation
- **No Business Logic**: Pure data access

### 4. **Schema Layer** (`schema/`)
- **Purpose**: Database models & types
- **Responsibility**:
  - Define Mongoose schemas
  - TypeScript interfaces
  - Database validation rules
  - Model definitions

### 5. **Middleware Layer** (`middleware/`)
- **Purpose**: Request processing
- **Responsibility**:
  - Authentication (JWT verification)
  - Request validation
  - Error handling
  - Logging

### 6. **Cache Layer** (`cache/`)
- **Purpose**: Redis caching utilities
- **Responsibility**:
  - Cache key generation
  - Cache get/set operations
  - TTL management

### 7. **Config Layer** (`config/`)
- **Purpose**: Application configuration
- **Responsibility**:
  - Passport.js strategies
  - OAuth configuration
  - Environment setup

## 📊 Example: Get Top Cryptos Flow

```
HTTP Request: GET /crypto/top?topN=10
        │
        ▼
┌───────────────────┐
│ crypto.controller │  ← Controller (HTTP Handler)
│     .ts           │
└────────┬──────────┘
         │
         │ Validates topN parameter
         │ Calls service
         ▼
┌───────────────────┐
│ crypto.service.ts │  ← Service (Business Logic)
└────────┬──────────┘
         │
         │ 1. Check Redis cache
         │    └─ Cache Hit? Return cached data
         │
         │ 2. Cache Miss? Call repository
         ▼
┌───────────────────┐
│ crypto.repository │  ← Repository (Data Access)
│     .ts           │
└────────┬──────────┘
         │
         │ Query MongoDB
         ▼
┌───────────────────┐
│    MongoDB        │  ← Database
│  CryptoCurrency   │
│    Collection     │
└────────┬──────────┘
         │
         │ Returns data
         ▼
┌───────────────────┐
│ Repository        │  ← Transform & return
└────────┬──────────┘
         │
         │ Service caches result
         ▼
┌───────────────────┐
│ Redis Cache       │  ← Store for next time
└────────┬──────────┘
         │
         │ Service returns
         ▼
┌───────────────────┐
│ Controller        │  ← Format response
└────────┬──────────┘
         │
         │ HTTP Response
         ▼
┌───────────────────┐
│  Client receives  │  ← JSON: [{...crypto data...}]
│     JSON data     │
└───────────────────┘
```

## 🔑 Key Principles

1. **Separation of Concerns**
   - Controllers = HTTP handling
   - Services = Business logic
   - Repositories = Data access
   - Schema = Data models

2. **Layered Architecture**
   - Each layer only knows about the next layer
   - Controllers → Services → Repositories → Database
   - Clear boundaries between layers

3. **Caching Strategy**
   - Cache-aside pattern
   - Check cache first, then database
   - Store results in cache for future requests

4. **Error Handling**
   - Errors bubble up through layers
   - Controllers handle HTTP error responses
   - Services handle business logic errors
   - Repositories handle data access errors

5. **Testability**
   - Each layer can be tested independently
   - Services can be mocked in controllers
   - Repositories can be mocked in services

## 🔐 Authentication Flow

```
User Clicks "Login with Google"
        │
        ▼
┌───────────────────┐
│ GET /auth/google  │  ← Controller
└────────┬──────────┘
         │
         │ Redirects to Google OAuth
         ▼
┌───────────────────┐
│  Google OAuth     │  ← External Service
└────────┬──────────┘
         │
         │ User authenticates
         │ Redirects back with code
         ▼
┌───────────────────┐
│ GET /auth/google  │  ← Controller
│    /callback     │
└────────┬──────────┘
         │
         │ Passport middleware
         ▼
┌───────────────────┐
│ passport.ts       │  ← Config (OAuth Strategy)
└────────┬──────────┘
         │
         │ Creates/updates user
         ▼
┌───────────────────┐
│ auth.repository   │  ← Repository (DB Operation)
└────────┬──────────┘
         │
         │ User saved to MongoDB
         ▼
┌───────────────────┐
│ Controller        │  ← Generate JWT token
└────────┬──────────┘
         │
         │ Redirect with token
         ▼
┌───────────────────┐
│ Frontend receives │  ← /auth-success?token=...
│     JWT token     │
└───────────────────┘
```

## 🗄️ Database Schema Relationships

```
┌─────────────────┐
│   User Schema    │
├─────────────────┤
│ id: string      │
│ email: string   │
│ name: string    │
│ avatar: string  │
│ favoriteCryptos │  ← Array of crypto IDs
│ isLoggedIn      │
│ isVerified       │
└─────────────────┘

┌─────────────────┐
│  Crypto Schema  │
├─────────────────┤
│ id: string      │
│ name: string    │
│ symbol: string  │
│ current_price   │
│ market_cap      │
│ market_cap_rank │
│ ...             │
└─────────────────┘

┌──────────────────────┐
│ Crypto Historic     │
│      Data Schema    │
├─────────────────────┤
│ id: string          │
│ prices: [[timestamp,│
│          value]]    │
│ market_caps: [...]  │
│ total_volumes: [...]│
└─────────────────────┘
```

## 🔄 Caching Strategy

```
Request → Service Layer
    │
    ├─→ Check Redis Cache
    │   │
    │   ├─→ Cache Hit? 
    │   │   └─→ Return cached data ✅
    │   │
    │   └─→ Cache Miss?
    │       └─→ Continue to repository
    │
    └─→ Call Repository
        │
        └─→ Query Database
            │
            └─→ Store in Redis Cache
                │
                └─→ Return to service
                    │
                    └─→ Return to controller
                        │
                        └─→ Return HTTP response
```

## 📚 Related Concepts

- **MVC Pattern**: Model-View-Controller (Controllers = Controllers, Services = Business Logic, Repositories = Models)
- **Repository Pattern**: Abstracts data access layer
- **Service Layer Pattern**: Encapsulates business logic
- **Cache-Aside Pattern**: Check cache, then database
- **RESTful API**: Standard HTTP methods (GET, POST, DELETE)
- **JWT Authentication**: Token-based authentication
- **OAuth 2.0**: Third-party authentication (Google)
- **Mongoose**: MongoDB ODM (Object Document Mapper)
- **Redis**: In-memory caching database

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Cache**: Redis (via ioredis)
- **Authentication**: Passport.js + JWT
- **OAuth**: Google OAuth 2.0
- **Testing**: Jest + Supertest
- **Cron Jobs**: node-cron

