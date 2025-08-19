# URIP - Tokenized Asset Trading Platform

A modern, professional trading platform built with Next.js, featuring comprehensive portfolio management, tokenized asset trading, mutual fund purchases, and DAO governance for fund manager selection.

## 🚀 Features

### 📊 **Dashboard**
- Real-time portfolio overview with interactive charts
- Portfolio allocation visualization with pie charts
- Financial metrics and performance tracking
- Market data integration with TradingView widgets
- Responsive design with professional glass-morphism UI
- Asset allocation breakdown by individual stocks with unique colors

### 💹 **Trading Platform**
- **Asset Trading**: Direct buy/sell functionality for tokenized assets
- **Mutual Fund Purchases**: Simplified mutual fund investment with USDT
- **Transaction History**: Recent activity tracking with detailed popups
- **Block Explorer Integration**: Direct links to Lisk Sepolia Blockscout
- Advanced trading interface with order management
- Real-time market data and price charts

### 📈 **Portfolio Management**
- Interactive portfolio performance charts with hover interactions
- Asset allocation visualization with detailed breakdowns
- Transaction history with comprehensive details
- Real-time P&L tracking and performance metrics
- Individual stock tracking with color-coded allocation

### 🗳️ **DAO Governance**
- Fund manager selection through community voting
- Detailed candidate profiles with performance metrics
- Asset allocation transparency for each fund manager
- Real-time voting results and quorum tracking
- Professional proposal management system

### 🔐 **Authentication & Security**
- Web3 wallet integration with Wagmi
- Protected routes for authenticated users
- Secure transaction handling with smart contracts
- USDT approval and balance management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Charts**: Recharts for portfolio allocation + TradingView integration
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Web3**: Wagmi for Ethereum interactions
- **Smart Contracts**: Integration with custom purchase manager contracts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/test-4u.git
   cd test-4u
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
test-4u/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard with portfolio allocation
│   ├── trade/                   # Trading interface
│   │   ├── [symbol]/           # Individual asset trading pages
│   │   └── purchase-mutual-fund/ # Mutual fund purchase
│   ├── portfolio/               # Portfolio management
│   ├── dao/                     # DAO governance
│   ├── login/                   # Authentication page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── partials/                # Dashboard-specific components
│   │   └── Dashboard/           # DashboardLayout, GlassCard, ActionButton
│   ├── features/                # Feature-specific components
│   ├── Navigation.tsx           # Unified navigation bar
│   ├── PortfolioChart.tsx       # Custom portfolio chart
│   ├── TradingViewWidget.tsx    # TradingView integration
│   └── TradingViewAdvanced.tsx  # Advanced trading view
├── hooks/                       # Custom React hooks
│   ├── useAssetTokens.ts        # Asset token management
│   ├── usePurchaseManager.ts    # Smart contract interactions
│   ├── useTransactionHistory.ts # Transaction history
│   └── useDAOGovernance.ts      # DAO governance
├── config/                      # Configuration files
│   ├── contracts.ts             # Smart contract addresses
│   └── xellarConfig.ts          # Xellar configuration
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🎨 Design System

### Unified Dashboard Design
- **DashboardLayout**: Consistent background effects and container structure
- **GlassCard**: Glass morphism styling with backdrop blur and hover effects
- **ActionButton**: Custom button variants with orange gradient and animations
- **Color Scheme**: Dark theme with orange accent (#F77A0E)

### Color Palette
- **Primary Background**: Black with animated gradient orbs
- **Secondary Background**: Gray-900/80 with glass morphism
- **Accent Color**: Orange (#F77A0E) for primary actions
- **Text Colors**: White for primary, gray-400 for secondary
- **Borders**: Gray-700/50 with orange accents

### Components
- **Cards**: Professional glass-morphism design with backdrop blur
- **Navigation**: Unified navigation across all pages
- **Charts**: Interactive charts with hover states and animations
- **Forms**: Clean, accessible form components with proper validation

## 📱 Pages Overview

### 1. **Dashboard** (`/dashboard`)
- Financial overview with key metrics
- Portfolio allocation pie chart with individual stock colors
- Market data integration with TradingView
- Quick access to trading and portfolio features
- Real-time asset token data from smart contracts

### 2. **Trade** (`/trade`)
- Recent activity section with transaction history
- Transaction details popup with block explorer links
- Navigation to mutual fund purchases
- Real-time market data with TradingView charts
- Order placement and management

### 3. **Asset Trading** (`/trade/[symbol]`)
- Individual asset trading pages
- Real-time price charts with TradingView integration
- Buy/sell functionality with USDT
- Market information and holdings display
- Stock details and news integration

### 4. **Mutual Fund Purchase** (`/trade/purchase-mutual-fund`)
- Simplified mutual fund investment interface
- USDT balance and allowance management
- Smart contract integration for purchases
- Transaction status and confirmation

### 5. **Portfolio** (`/portfolio`)
- Comprehensive portfolio overview
- Interactive performance charts with timeframe selection
- Detailed asset allocation and holdings
- Transaction history with filtering options

### 6. **DAO** (`/dao`)
- Fund manager selection proposals
- Candidate profiles with performance metrics
- Asset allocation transparency
- Community voting interface with real-time results

### 7. **Login** (`/login`)
- Web3 wallet authentication
- Clean, focused login interface
- Secure wallet connection

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_TRADINGVIEW_API_KEY=your_tradingview_key
NEXT_PUBLIC_CONTRACT_ADDRESSES=your_contract_addresses
```

### Smart Contract Integration
- **Purchase Manager**: Handles asset token and mutual fund purchases
- **Mock USDT**: ERC20 token for payments
- **Asset Tokens**: Individual tokenized assets
- **Lisk Sepolia**: Testnet for blockchain interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Works with Next.js static export
- **AWS Amplify**: Full-stack deployment support
- **Docker**: Use the included Dockerfile for containerization

## 📊 Features in Detail

### Portfolio Allocation
- Interactive pie chart showing asset distribution
- Individual stock names instead of categories
- Unique colors for each stock for better visualization
- Real-time data from smart contracts

### Transaction History
- Recent activity tracking with API integration
- Detailed transaction popups with comprehensive information
- Block explorer links to Lisk Sepolia
- Safe data formatting to prevent UI errors

### Mutual Fund Purchases
- Simplified interface focused on USDT payments
- Smart contract integration for secure transactions
- Balance and allowance management
- Transaction status tracking

### Unified Design System
- Consistent glass-morphism design across all pages
- Professional dark theme with orange accents
- Responsive design that works on all devices
- Smooth animations and hover effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the excellent component library
- **TradingView** for market data integration
- **Lucide** for the beautiful icon set
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for interactive chart components
- **Wagmi** for Web3 integration

## 📞 Support

For support, email [support@urip.com](mailto:support@urip.com) or join our Discord community.

---

**Built with ❤️ by the URIP Team**
