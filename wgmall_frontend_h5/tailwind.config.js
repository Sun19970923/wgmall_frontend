/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // 扫描 src 目录下的所有 React 文件
    './pages/**/*.{js,jsx,ts,tsx}', // 如果 Umi 有 pages 目录也要加上
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
