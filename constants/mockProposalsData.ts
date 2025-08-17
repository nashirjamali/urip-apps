import type { DAO } from "@/types";

export const mockDAOs: DAO[] = [
  {
    id: "1",
    title: "Fund Manager Selection Q3 2025",
    endTime: "2025-08-30 23:59:59",
    percentageAgree: 67,
    percentageAgainst: 33,
    countParticipation: 1247,
    status: "Active",
    description:
      "Vote for the next fund manager to handle our Q3 portfolio allocation strategy.",
    assetAllocation: [
      {
        name: "Apple Inc.",
        symbol: "tAAPL",
        percentage: 35,
        icon: "🍎",
        detail: "Technology sector leader",
      },
      {
        name: "Microsoft Corp",
        symbol: "tMSFT",
        percentage: 30,
        icon: "🏢",
        detail: "Cloud computing giant",
      },
      {
        name: "Gold",
        symbol: "tXAU",
        percentage: 20,
        icon: "🥇",
        detail: "Safe haven asset",
      },
      {
        name: "Bitcoin",
        symbol: "tBTC",
        percentage: 15,
        icon: "₿",
        detail: "Digital gold",
      },
    ],
    voters: [
      {
        address: "0x1234...5678",
        reason: "Strong tech allocation",
        vote: "Agree",
      },
      {
        address: "0x9abc...def0",
        reason: "Too risky for current market",
        vote: "Against",
      },
      { address: "0x5555...9999", reason: "Balanced approach", vote: "Agree" },
    ],
  },
  {
    id: "2",
    title: "ESG Investment Strategy",
    endTime: "2025-08-25 18:00:00",
    percentageAgree: 78,
    percentageAgainst: 22,
    countParticipation: 892,
    status: "Active",
    description:
      "Proposal to integrate ESG criteria into our investment selection process.",
    assetAllocation: [
      {
        name: "Tesla Inc.",
        symbol: "tTSLA",
        percentage: 40,
        icon: "🚗",
        detail: "Clean energy leader",
      },
      {
        name: "Solar Energy",
        symbol: "tSOLAR",
        percentage: 25,
        icon: "☀️",
        detail: "Renewable energy",
      },
      {
        name: "Clean Water",
        symbol: "tH2O",
        percentage: 20,
        icon: "💧",
        detail: "Water sustainability",
      },
      {
        name: "Green Bonds",
        symbol: "tGREEN",
        percentage: 15,
        icon: "🌱",
        detail: "Environmental bonds",
      },
    ],
    voters: [
      {
        address: "0xabc1...2345",
        reason: "Future-focused strategy",
        vote: "Agree",
      },
      {
        address: "0xdef6...7890",
        reason: "Need more diversification",
        vote: "Against",
      },
    ],
  },
  {
    id: "3",
    title: "Q2 2025 Portfolio Rebalancing",
    endTime: "2025-07-15 23:59:59",
    percentageAgree: 85,
    percentageAgainst: 15,
    countParticipation: 2156,
    status: "Executed",
    description:
      "Successfully executed proposal to rebalance portfolio allocation for Q2 2025.",
    assetAllocation: [
      {
        name: "Nvidia Corp",
        symbol: "tNVDA",
        percentage: 40,
        icon: "🔥",
        detail: "AI technology leader",
      },
      {
        name: "Amazon",
        symbol: "tAMZN",
        percentage: 25,
        icon: "📦",
        detail: "E-commerce giant",
      },
      {
        name: "Ethereum",
        symbol: "tETH",
        percentage: 20,
        icon: "⧫",
        detail: "Smart contract platform",
      },
      {
        name: "S&P 500 ETF",
        symbol: "tSPY",
        percentage: 15,
        icon: "📈",
        detail: "Market index",
      },
    ],
    voters: [
      {
        address: "0x7777...8888",
        reason: "AI sector growth potential",
        vote: "Agree",
      },
      {
        address: "0x2222...3333",
        reason: "Great diversification",
        vote: "Agree",
      },
      {
        address: "0x4444...5555",
        reason: "Too concentrated in tech",
        vote: "Against",
      },
    ],
  },
  {
    id: "4",
    title: "DeFi Integration Proposal",
    endTime: "2025-06-01 23:59:59",
    percentageAgree: 45,
    percentageAgainst: 55,
    countParticipation: 1834,
    status: "Executed",
    description:
      "Proposal to integrate DeFi protocols was rejected by community vote.",
    assetAllocation: [
      {
        name: "Uniswap",
        symbol: "tUNI",
        percentage: 30,
        icon: "🦄",
        detail: "DEX protocol",
      },
      {
        name: "Aave",
        symbol: "tAAVE",
        percentage: 25,
        icon: "👻",
        detail: "Lending protocol",
      },
      {
        name: "Compound",
        symbol: "tCOMP",
        percentage: 25,
        icon: "🏛️",
        detail: "Lending platform",
      },
      {
        name: "Chainlink",
        symbol: "tLINK",
        percentage: 20,
        icon: "🔗",
        detail: "Oracle network",
      },
    ],
    voters: [
      {
        address: "0x9999...aaaa",
        reason: "Too risky for current market",
        vote: "Against",
      },
      {
        address: "0xbbbb...cccc",
        reason: "DeFi has good potential",
        vote: "Agree",
      },
      {
        address: "0xdddd...eeee",
        reason: "Smart contracts are unproven",
        vote: "Against",
      },
    ],
  },
];
