# Frontend Architecture Diagram

## 📁 Directory Structure

```
frontend/src/
│
├── 📄 main.tsx                    # Application Entry Point
│   └── Renders App component, sets up Router & Context
│
├── 📄 App.tsx                      # Root Component
│   └── Defines all routes
│
├── 📁 pages/                       # Page Components (UI Only)
│   ├── dashboard.tsx               # Main dashboard page
│   ├── auth/
│   │   ├── login.tsx              # Login page
│   │   └── auth-success.tsx       # OAuth callback handler
│   └── chat/
│       ├── index.tsx               # Chat page
│       └── components/             # Chat-specific components
│           ├── price-response.tsx
│           └── trend-response.tsx
│
├── 📁 components/                  # Reusable UI Components
│   └── dashboard/
│       ├── detail-header.tsx       # Crypto header component
│       ├── detail-metrics.tsx      # Metrics display
│       ├── detail-charts.tsx       # Chart visualization
│       └── detail-recent-snapshots.tsx
│
├── 📁 hooks/                       # Custom React Hooks (Business Logic)
│   ├── use-auth.ts                # Authentication logic
│   ├── use-auth-success.ts        # OAuth success handler
│   ├── use-favorites.ts           # Favorites management
│   ├── use-sorting.ts             # Table sorting logic
│   ├── use-top-cryptos.ts         # Fetch top cryptocurrencies
│   ├── use-crypto-historic-data.ts # Fetch historical data
│   └── use-crypto-search.ts        # Search functionality
│
├── 📁 services/                    # API Communication Layer
│   ├── auth.service.ts            # Auth API calls
│   └── favorites.service.ts       # Favorites API calls
│
├── 📁 context/                     # React Context (Global State)
│   └── user-context.tsx           # User state management
│
├── 📁 types/                       # TypeScript Type Definitions
│   ├── user.ts                    # User interface
│   └── crypto.ts                  # Crypto interfaces
│
└── 📁 config/                      # Configuration
    └── constants.ts               # API URLs, constants
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                      │
│                    (Clicks, Inputs, etc.)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         PAGES LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  dashboard   │  │    login     │  │     chat     │     │
│  │    .tsx      │  │    .tsx      │  │    .tsx      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (UI Only - No Business Logic)                        │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      COMPONENTS LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ detail-header│  │detail-metrics│  │detail-charts │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (Reusable UI Components)                             │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        HOOKS LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  use-auth    │  │use-favorites │  │ use-sorting  │     │
│  │  use-top-    │  │use-crypto-   │  │ use-crypto-  │     │
│  │  cryptos     │  │historic-data │  │ search       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (Business Logic - State Management)                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                           │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ auth.service │  │favorites.     │                        │
│  │    .ts       │  │service.ts    │                        │
│  └──────┬───────┘  └──────┬───────┘                        │
│         │                 │                                  │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│         (API Calls - HTTP Requests)                          │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (HTTP)                         │
│              http://localhost:4000/api/...                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Layer Responsibilities

### 1. **Pages Layer** (`pages/`)
- **Purpose**: Route-level components
- **Responsibility**: 
  - Define page structure
  - Compose components
  - Handle routing
- **No Logic**: Only UI composition

### 2. **Components Layer** (`components/`)
- **Purpose**: Reusable UI components
- **Responsibility**:
  - Display data
  - Handle user interactions (UI only)
  - Receive props, emit events
- **No API Calls**: Pure presentation

### 3. **Hooks Layer** (`hooks/`)
- **Purpose**: Business logic & state management
- **Responsibility**:
  - Manage component state
  - Orchestrate data fetching
  - Handle business rules
  - Call services
- **No UI**: Logic only

### 4. **Services Layer** (`services/`)
- **Purpose**: API communication
- **Responsibility**:
  - Make HTTP requests
  - Handle API responses
  - Transform data if needed
- **No State**: Pure functions

### 5. **Context Layer** (`context/`)
- **Purpose**: Global state management
- **Responsibility**:
  - Share state across components
  - User authentication state
  - App-wide data

### 6. **Types Layer** (`types/`)
- **Purpose**: TypeScript definitions
- **Responsibility**:
  - Define data structures
  - Type safety
  - Documentation

## 📊 Example: Dashboard Data Flow

```
User Opens Dashboard
        │
        ▼
┌───────────────────┐
│  dashboard.tsx    │  ← Page Component (UI)
└────────┬──────────┘
         │
         │ Uses Hooks
         ▼
┌───────────────────┐
│ use-top-cryptos   │  ← Hook (Business Logic)
│ use-auth          │
│ use-favorites     │
│ use-sorting       │
└────────┬──────────┘
         │
         │ Calls Services
         ▼
┌───────────────────┐
│ auth.service.ts   │  ← Service (API Calls)
└────────┬──────────┘
         │
         │ HTTP Request
         ▼
┌───────────────────┐
│  Backend API      │  ← http://localhost:4000/crypto/top
└───────────────────┘
         │
         │ Response
         ▼
┌───────────────────┐
│  Service Returns  │  ← Data transformed
└────────┬──────────┘
         │
         │ Hook Updates State
         ▼
┌───────────────────┐
│  Hook Returns     │  ← { cryptos, isLoading, error }
└────────┬──────────┘
         │
         │ Props/State
         ▼
┌───────────────────┐
│  Component Renders│  ← UI Updates
└───────────────────┘
```

## 🔑 Key Principles

1. **Separation of Concerns**
   - Pages = UI structure
   - Components = Reusable UI
   - Hooks = Business logic
   - Services = API calls

2. **Unidirectional Data Flow**
   - Data flows down (props)
   - Events flow up (callbacks)
   - State managed in hooks

3. **Reusability**
   - Components can be reused
   - Hooks can be shared
   - Services are modular

4. **Testability**
   - Each layer can be tested independently
   - Logic separated from UI
   - Services can be mocked

## 📚 Related Concepts

- **React Hooks**: Custom hooks encapsulate logic
- **Context API**: Global state management
- **Service Layer Pattern**: Separates API calls from components
- **Component Composition**: Building complex UIs from simple components
- **TypeScript**: Type safety across layers

