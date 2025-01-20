/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
		"./node_modules/flowbite/**/*.js"
	],
	theme: {
		extend: {},
	},
	prefix: '',
	// prefix: 'tw-',
	plugins: [
		require('flowbite/plugin')
	],
}

