/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
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
        bg: {
          primary: "rgb(var(--bg-primary))",
          secondary: "rgb(var(--bg-secondary))",
          tertiary: "rgb(var(--bg-tertiary))",
        },
        text: {
          primary: "rgb(var(--text-primary))",
          secondary: "rgb(var(--text-secondary))",
          tertiary: "rgb(var(--text-tertiary))",
        },
        border: {
          DEFAULT: "rgb(var(--border-primary))",
          secondary: "rgb(var(--border-secondary))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        pastel: {
          pink: "rgb(var(--pastel-pink))",
          blue: "rgb(var(--pastel-blue))",
          green: "rgb(var(--pastel-green))",
          yellow: "rgb(var(--pastel-yellow))",
          purple: "rgb(var(--pastel-purple))",
          orange: "rgb(var(--pastel-orange))",
        },
        ptext: {
          pink: "rgb(var(--text-pink))",
          blue: "rgb(var(--text-blue))",
          green: "rgb(var(--text-green))",
          yellow: "rgb(var(--text-yellow))",
          purple: "rgb(var(--text-purple))",
          orange: "rgb(var(--text-orange))",
        }
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '1.2': '1.2px',
        '3': '3px',
      },
      transformOrigin: {
        'neo': 'top left',
      },
    },
  },
  plugins: [],
}