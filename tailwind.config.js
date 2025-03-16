/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans your files
  theme: {
    extend: {
      colors: {
        border: "var(--border)", // Define the `border-border` class dynamically
        input: "var(--input)",
        ring: "var(--ring)",
      },
    },
  },
  plugins: [],
};
