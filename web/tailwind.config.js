/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'type--bug': '#729f3f',
				'type--fairy': '#fdb9e9',
				'type--fire': '#fd7d24',
				'type--ghost': '#7b62a3',
				'type--normal': '#a4acaf',
				'type--psychic': '#f366b9',
				'type--steel': '#9eb7b8',
				'type--dark': '#707070',
				'type--electric': '#eed535',
				'type--fighting': '#d56723',
				'type--grass': '#9bcc50',
				'type--ice': '#51c4e7',
				'type--poison': '#b97fc9',
				'type--rock': '#a38c21',
				'type--water': '#4592c4',
			},
			backgroundImage: {
				'type--dragon': 'linear-gradient(180deg, #53a4cf 50%, #f16e57 50%)',
				'type--ground': 'linear-gradient(180deg, #f7de3f 50%, #ab9842 50%)',
				'type--flying': 'linear-gradient(180deg, #3dc7ef 50%, #bdb9b8 50%)',
			},
		},
	},
	plugins: [],
};
