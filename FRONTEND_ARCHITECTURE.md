# Frontend Architecture

## 📁 Directory Structure

```
frontend/src/
│
├── main.tsx                    # Entry point - renders App
├── App.tsx                     # Root component - defines routes
│
├── pages/                      # Page components (UI only)
│   ├── dashboard.tsx           # Main dashboard page
│   ├── auth/
│   │   ├── login.tsx           # Login page
│   │   └── auth-success.tsx    # OAuth callback handler
│   └── chat/
│       ├── index.tsx           # Chat page
│       └── components/         # Chat-specific components
│           ├── price-response.tsx
│           └── trend-response.tsx
│
├── components/                 # Reusable UI components
│   └── dashboard/
│       ├── detail-header.tsx
│       ├── detail-metrics.tsx
│       ├── detail-charts.tsx
│       └── detail-recent-snapshots.tsx
│
├── hooks/                      # Business logic hooks
│   ├── use-auth.ts             # Authentication logic
│   ├── use-auth-success.ts     # OAuth success handler
│   ├── use-favorites.ts        # Favorites management
│   ├── use-sorting.ts          # Table sorting logic
│   ├── use-top-cryptos.ts      # Fetch top cryptocurrencies
│   ├── use-crypto-historic-data.ts
│   └── use-crypto-search.ts    # Search functionality
│
├── services/                   # API communication
│   ├── auth.service.ts         # Auth API calls
│   └── favorites.service.ts    # Favorites API calls
│
├── context/                    # Global state
│   └── user-context.tsx        # User state management
│
└── types/                      # TypeScript definitions
    ├── user.ts
    └── crypto.ts
```

## 🔄 Architecture Flow

```
User Interaction
    ↓
Pages (UI structure)
    ↓
Components (Reusable UI)
    ↓
Hooks (Business logic + State)
    ↓
Services (API calls)
    ↓
Backend API
```

## 📄 Pages & Routes

### `/` (Login Page)
- Two buttons: "Login with Google" and "Continue as Guest"
- Redirects to dashboard after login/guest selection
- Default landing page

### `/dashboard`
- Displays table of top 10 cryptocurrencies
- Shows: rank, market cap, price, 24h % change, volume
- Sorting buttons for: rank, market cap, price, 24h %
- Heart icon to favorite/unfavorite cryptos (requires login)
- Click on crypto row to view details
- Details panel shows: header, metrics, charts, recent snapshots

### `/chat`
- Chat interface for crypto queries
- Supports natural language questions:
  - "What is the price of Bitcoin?"
  - "Show me the 7-day trend of Ethereum"
  - "What is the market cap of Solana?"
- Displays price responses or trend charts based on query type
- Handles greetings and general chat client-side
- Shows "couldn't find" message for empty responses

### `/auth-success`
- Handles OAuth callback from Google
- Extracts JWT token from URL
- Stores token and fetches user data
- Redirects to dashboard (removes token from URL)

## 🎯 Key Concepts

**Pages** → Route-level components, compose UI only

**Components** → Reusable UI pieces, receive props, no business logic

**Hooks** → Business logic and state management, call services

**Services** → Make HTTP requests to backend API

**Context** → Global state (user authentication, app-wide data)

**Types** → TypeScript definitions for type safety

## 🔑 Data Flow Example

1. User opens dashboard
2. `dashboard.tsx` uses `use-top-cryptos` hook
3. Hook calls `auth.service.ts` to fetch data
4. Service makes HTTP request to backend
5. Response updates hook state
6. Component re-renders with new data

## 🛠️ Technology Stack

- React + TypeScript
- React Router DOM (routing)
- Tailwind CSS (styling)
- Context API (global state)
- Custom Hooks (business logic)
