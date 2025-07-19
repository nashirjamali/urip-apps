# EquityHunter Frontend

A modern, professional trading platform built with Next.js, featuring comprehensive portfolio management, automated trading, and DAO governance for fund manager selection.

## 🚀 Features

### 📊 **Dashboard**
- Real-time portfolio overview with interactive charts
- Financial metrics and performance tracking
- Market data integration with TradingView widgets
- Responsive design with professional UI components

### 💹 **Trading Platform**
- **Manual Trading**: Direct buy/sell functionality with real-time market data
- **Auto Trading**: Managed allocation with professional fund managers
- Advanced trading interface with order management
- Price alerts and market analysis tools

### 📈 **Portfolio Management**
- Interactive portfolio performance charts with hover interactions
- Asset allocation visualization with detailed breakdowns
- Transaction history with comprehensive details
- Real-time P&L tracking and performance metrics

### 🗳️ **DAO Governance**
- Fund manager selection through community voting
- Detailed candidate profiles with performance metrics
- Asset allocation transparency for each fund manager
- Real-time voting results and quorum tracking
- Professional proposal management system

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Charts**: Custom Canvas-based charts + TradingView integration
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hackathon-Hunter/equityhunter-fe.git
   cd equityhunter-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
equityhunter-fe/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard page
│   ├── trade/                   # Trading interface
│   ├── portfolio/               # Portfolio management
│   ├── dao/                     # DAO governance
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── Navigation.tsx           # Unified navigation bar
│   ├── PortfolioChart.tsx       # Custom portfolio chart
│   ├── TradingViewWidget.tsx    # TradingView integration
│   └── TradingViewAdvanced.tsx  # Advanced trading view
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
└── public/                      # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `from-dark-bg-primary to-dark-bg-secondary`
- **Secondary Background**: `bg-dark-bg-secondary/80`
- **Accent Color**: `text-dark-accent-blue`
- **Text Colors**: `text-dark-text-primary`, `text-dark-text-secondary`
- **Borders**: `border-dark-border`

### Components
- **Cards**: Professional glass-morphism design with backdrop blur
- **Navigation**: Unified TradePro branded navigation across all pages
- **Charts**: Interactive custom charts with hover states and animations
- **Forms**: Clean, accessible form components with proper validation

## 📱 Pages Overview

### 1. **Dashboard** (`/dashboard`)
- Financial overview with key metrics
- Portfolio performance visualization
- Market data integration
- Quick access to trading and portfolio features

### 2. **Trade** (`/trade`)
- Manual vs Auto trading mode selection
- Real-time market data with TradingView charts
- Order placement and management
- Price alerts and market analysis

### 3. **Portfolio** (`/portfolio`)
- Comprehensive portfolio overview
- Interactive performance charts with timeframe selection
- Detailed asset allocation and holdings
- Transaction history with filtering options

### 4. **DAO** (`/dao`)
- Fund manager selection proposals
- Candidate profiles with performance metrics
- Asset allocation transparency
- Community voting interface with real-time results

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_TRADINGVIEW_API_KEY=your_tradingview_key
```

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.ts`
- **Components**: Customize UI components in `components/ui/`
- **Layouts**: Adjust page layouts in respective page files
- **Navigation**: Update navigation items in `components/Navigation.tsx`

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

### Interactive Charts
- Custom Canvas-based portfolio performance charts
- Hover interactions with detailed tooltips
- Timeframe selection (1D, 1W, 1M, 3M, 1Y)
- Real-time data updates

### DAO Governance
- Professional proposal layout similar to established DAO platforms
- Comprehensive fund manager profiles with:
  - Performance metrics (Total Return, Sharpe Ratio, Max Drawdown, Win Rate)
  - Asset allocation transparency
  - Fee structure details
  - Team information and compliance status

### Trading Interface
- Dual-mode trading (Manual/Auto)
- Real-time market data integration
- Advanced order types and management
- Portfolio integration for seamless trading

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

## 📞 Support

For support, email [support@equityhunter.com](mailto:support@equityhunter.com) or join our Discord community.

---

**Built with ❤️ by the EquityHunter Team**
