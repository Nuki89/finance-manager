/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
		"./node_modules/flowbite/**/*.js"
	],
	theme: {
		extend: {
			colors: {
				primary: {
					600: '#2563eb',
					700: '#1d4ed8',
					300: '#93c5fd',
					800: '#1e3a8a',
				},
			},
		},
	},
	prefix: '',
	// prefix: 'tw-',
	plugins: [
		require('flowbite/plugin')
	],
}

