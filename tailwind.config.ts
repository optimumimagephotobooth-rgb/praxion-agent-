import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        "figma-h1": ["30px", { lineHeight: "36px" }],
        "figma-body": ["14px", { lineHeight: "20px" }]
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "ambient-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" }
        },
        "gentle-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 30px rgba(139, 92, 246, 0.1), 0 0 60px rgba(6, 182, 212, 0.05)"
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(139, 92, 246, 0.15), 0 0 80px rgba(6, 182, 212, 0.08)"
          }
        },
        "soft-ripple": {
          "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: "0.8" },
          "100%": { transform: "translate(-50%, -50%) scale(1.5)", opacity: "0" }
        },
        "data-stream": {
          "0%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "node-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.3))"
          },
          "50%": {
            filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))"
          }
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.95" },
          "50%": { transform: "translateY(-12px) scale(1.02)", opacity: "1" }
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        "float-particle": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.5" },
          "100%": {
            transform: "translateY(-100vh) translateX(100px)",
            opacity: "0"
          }
        },
        ripple: {
          to: { width: "300px", height: "300px", opacity: "0" }
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        "fade-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        "progress-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" }
        },
        shrink: {
          from: { width: "100%" },
          to: { width: "0%" }
        },
        "grow-up": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--target-height)", opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(139, 92, 246, 0.25)" }
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ambient-glow": "ambient-glow 4s ease-in-out infinite",
        "gentle-pulse": "gentle-pulse 6s ease-in-out infinite",
        "soft-ripple": "soft-ripple 2.4s ease-out infinite",
        "data-stream": "data-stream 8s linear infinite",
        "node-glow": "node-glow 3s ease-in-out infinite",
        "gentle-float": "gentle-float 8s ease-in-out infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
        "float-particle": "float-particle 18s linear infinite",
        ripple: "ripple 0.6s linear",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in-left": "fade-in-left 0.7s ease-out forwards",
        "fade-in-right": "fade-in-right 0.7s ease-out forwards",
        "scale-in": "scale-in 0.7s ease-out forwards",
        "progress-pulse": "progress-pulse 2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        shrink: "shrink 4s linear",
        "grow-up": "grow-up 0.6s ease-out backwards",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
        scanline: "scanline 2s linear infinite"
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding"
      },
      backdropBlur: {
        xs: "2px"
      },
      backgroundImage: {
        "gradient-futuristic": "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        "gradient-glow":
          "radial-gradient(circle at center, rgba(139, 92, 246, 0.15), transparent 70%)",
        "cyber-gradient": "linear-gradient(45deg, #8B5CF6, #06B6D4)"
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "hsl(var(--primary-foreground))"
        },
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)"
        },
        emerald: {
          DEFAULT: "var(--emerald)",
          light: "var(--emerald-light)"
        },
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        slate: {
          50: "var(--slate-50)",
          100: "var(--slate-100)",
          200: "var(--slate-200)",
          700: "var(--slate-700)",
          900: "var(--slate-900)"
        },
        gray: {
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          900: "var(--gray-900)"
        },
        futuristic: {
          primary: "#8B5CF6",
          "primary-dark": "#7C3AED",
          "primary-light": "#A78BFA",
          secondary: "#06B6D4",
          "secondary-dark": "#0891B2",
          accent: "#10B981",
          "accent-dark": "#059669",
          surface: "#0F172A",
          "surface-light": "#1E293B",
          "surface-lighter": "#334155"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        ring: "hsl(var(--ring))"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: []
};

export default config;
