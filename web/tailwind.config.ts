import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "hsl(var(--color-page))",
        card: "hsl(var(--color-card))",
        border: "hsl(var(--color-border))",
        ink: "hsl(var(--color-ink))",
        muted: "hsl(var(--color-muted))",
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(var(--color-primary-foreground))",
          soft: "hsl(var(--color-primary-soft))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        card: "var(--shadow)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
