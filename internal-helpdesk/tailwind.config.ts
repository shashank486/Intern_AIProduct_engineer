import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "hsl(var(--canvas))",
          subtle: "hsl(var(--canvas-subtle))",
          inset: "hsl(var(--canvas-inset))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
          faint: "hsl(var(--ink-faint))",
        },
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        signal: {
          open: "hsl(var(--signal-open))",
          progress: "hsl(var(--signal-progress))",
          resolved: "hsl(var(--signal-resolved))",
          closed: "hsl(var(--signal-closed))",
        },
        urgency: {
          low: "hsl(var(--urgency-low))",
          medium: "hsl(var(--urgency-medium))",
          high: "hsl(var(--urgency-high))",
          critical: "hsl(var(--urgency-critical))",
        },
        card: "hsl(var(--card))",
        ring: "hsl(var(--accent))",
        destructive: "hsl(var(--urgency-critical))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        lg: "10px",
        xl: "14px",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-dot": { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
