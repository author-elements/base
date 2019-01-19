import buble from 'rollup-plugin-buble'
import {uglify} from 'rollup-plugin-uglify'
import {terser} from 'rollup-plugin-terser'

const input = 'author-element.js'
const outdir = './dist'

export default [
	// Standard (Minified ES6)
	{
		input,
		plugins: [
			terser()
		],
		output: [{
			name: 'author-element.min.js',
			file: `${outdir}/author-element.min.js`,
			format: 'iife',
			sourcemap: true
		}]
	},

	// Legacy (Transpiled & Minified ES5)
	// This is only relevant to browsers.
	{
		input,
		plugins: [
			buble(),
			uglify()
		],
		output: [
			{
				name: 'author-element.es5.min.js',
				file: `${outdir}/author-element.es5.min.js`,
				format: 'iife',
				sourcemap: true
			}
		]
	},

	// Development: Standard (Unminified ES6)
	{
		input,
		plugins: [],
		output: [
			{
				name: 'author-element.js',
				file: `${outdir}/author-element.js`,
				format: 'iife',
				sourcemap: true
			},
		]
	},

	// Development: Legacy (Transpiled & Unminified ES5)
	// This is only relevant to browsers.
	{
		input,
		plugins: [
			buble()
		],
		output: [
			{
				name: 'author-element.es5.js',
				file: `${outdir}/author-element.es5.js`,
				format: 'iife',
				sourcemap: true
			}
		]
	}
]
