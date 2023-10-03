/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'white': 'rgb(255 255 255)',
      'line': '#D7DEDD',
      'purple': '#242339',
      'purple2': '#222A4A',
      'button': '#3B247B',
      'link': '#4B48B7',
      'red': '#ef4444',
      'border': '#3C4B83',
      'button-profile': '#B1AFC2',
      'blue-light': '#93C6E7',
      'blue-light2': "#AEE2FF",
      'blue-light3': "#93C6E7",
      'blue-light4': "#B9F3FC",
      'blue-dark': "#7286D3",
      'blue-dark2': "#7D7CA0",
      'purple-light': "#E5E0FF",
      'black': "#000000",
      'test': "#0C134F",
      'logo': "#4C5FA6",
      "transparent":"#00000000",
      "box-shadow": "#8EA7E9",
      "neon": "#04d9ff"
    },
    // fontFamily: {
    //   'roboto': ['monospace'],
    // },
    extend: {},
  },
  plugins: [],
}