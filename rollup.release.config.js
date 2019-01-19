import buble from 'rollup-plugin-buble'
import {uglify} from 'rollup-plugin-uglify'
import {terser} from 'rollup-plugin-terser'

const input = 'author-element.js'
const outdir = './dist'
const format = 'iife'

export default [
	// Standard (Minified ES6)
	{
		input,
		plugins: [
			terser()
		],
		output: [{
			name: 'AuthorElement',
			file: `${outdir}/author-element.min.js`,
			format,
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
				name: 'AuthorElement',
				file: `${outdir}/author-element.es5.min.js`,
				format,
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
				name: 'AuthorElement',
				file: `${outdir}/author-element.js`,
				format,
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
				name: 'AuthorElement',
				file: `${outdir}/author-element.es5.js`,
				format,
				sourcemap: true
			}
		]
	}
]
