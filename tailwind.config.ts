import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom color palette
        "primary-yellow": "#F2D544",
        "primary-blue": "#4A90E2",
        "primary-green": "#00D4AA",
        "primary-purple": "#8B5CF6",
        "dark-ui": "#1A1A2E",
        "light-gray": "#F8F9FA",
        "text-primary": "#2D3748",
        "text-secondary": "#718096",
        "success-green": "#48BB78",
        "error-red": "#F56565",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // New custom colors for the dark theme based on the image
        "dark-bg-primary": "#0A0A23", // Deep dark blue
        "dark-bg-secondary": "#1A1A3A", // Slightly lighter dark blue for cards
        "dark-text-primary": "#FFFFFF", // White text
        "dark-text-secondary": "#9090B0", // Updated: Muted purplish-gray text for labels
        "dark-accent-blue": "#6A5ACD", // Medium purple-blue for buttons/accents
        "dark-accent-purple": "#8A2BE2", // Brighter purple for highlights
        "dark-glow-blue": "#4A90E2", // Vibrant blue for glowing effects
        "dark-border": "#303060", // Darker border
        "dark-input": "#202040", // Darker input background
        // New colors for the specific card gradient
        "card-gradient-start": "#A0F0E0", // Light greenish-blue from screenshot
        "card-gradient-end": "#B0C0F0",   // Light purplish-blue from screenshot
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 25s linear infinite",
        "fade-in": "fade-in 1s ease-out forwards",
        "float-y": "float-y 4s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
