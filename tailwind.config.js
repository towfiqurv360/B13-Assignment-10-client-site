/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ডার্ক মোডের জন্য এটি অত্যন্ত জরুরি
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};