# 🚀 Jetapult Crypto Dashboard

A full-stack cryptocurrency dashboard with real-time market data, user authentication, and a rule-based chat assistant.

## ✨ Features

- 📊 **Dashboard**: Top 10 cryptocurrencies with prices, market cap, volume, and 24h changes
- 📈 **Charts**: Interactive 30-day price and market cap trends
- 💬 **Chat Assistant**: Natural language queries for crypto information
- ❤️ **Favorites**: Save favorite cryptos (requires login)
- 🔄 **Sorting**: Sort by rank, market cap, price, or 24h change
- 🔐 **Authentication**: Google OAuth or guest mode

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript 5.9
- Tailwind CSS 4.1
- Vite 7.2

**Backend:**
- Node.js 24.11.0 (LTS)
- Express.js 5.1
- TypeScript 5.6
- MongoDB (Mongoose 8.19)
- Redis (ioredis 5.8) - Optional
- Passport.js + JWT

## 🚀 Getting Started

### Prerequisites

- Node.js (v24.11.0 LTS or latest recommended)
- MongoDB (local or connection string)
- Redis (optional, for caching)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd jetapult

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

**Backend** (`backend/.env`):

**Required:**
```env
MONGO_URI=mongodb://localhost:27017/cryptodb
JWT_SECRET=your-secret-key-here
```

**Optional (with defaults):**
```env
PORT=4000                                    # Default: 4000
BACKEND_URL=http://localhost:4000          # Default: http://localhost:4000
FRONTEND_URL=http://localhost:5173          # Default: http://localhost:5173
REDIS_HOST=localhost                         # Optional - tries to connect, falls back to DB if connection fails or not set
REDIS_PORT=6379                              # Optional - tries to connect, falls back to DB if connection fails or not set
# OR use REDIS_URL for remote Redis (e.g., Upstash, Railway)
# REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-client-id        # Optional - guest mode available
GOOGLE_CLIENT_SECRET=your-google-client-secret # Optional - guest mode available
```

**Frontend** (`frontend/.env`):

**Optional (with default):**
```env
VITE_API_BASE_URL=http://localhost:4000     # Default: http://localhost:4000
```

### Running

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Backend: `http://localhost:4000`  
Frontend: `http://localhost:5173`

## 💬 Chat Assistant

Rule-based query parser that understands natural language questions about cryptocurrencies.

**How it works:**
- Identifies crypto names in queries
- Classifies query type (price, trend, market cap, etc.)
- Returns appropriate data based on query

**Example queries:**
- "What is the price of Bitcoin?"
- "Show me the 7-day trend of Ethereum"
- "What is the market cap of Solana?"

**Limitations:**
- Only supports CoinGecko top 10 cryptos
- Trend queries limited to 1-30 days
- Requires crypto name in query (rule-based, not AI)

## 📚 Documentation

- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
