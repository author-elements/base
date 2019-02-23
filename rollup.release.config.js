import buble from 'rollup-plugin-buble'
import {uglify} from 'rollup-plugin-uglify'
import {terser} from 'rollup-plugin-terser'

const input = 'author-base.js'
const outdir = './dist'
const format = 'iife'
const pkg = require('./package.json')
const banner = `// Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}. ${pkg.license} licensed.\n// ${pkg.name} v${pkg.version} available at ${pkg.repository.url.replace(/git\+|https:\/\/|\.git/gi, '')}\n// Last Build: ${(new Date().toLocaleString({ timeZone: 'UTC'}))}`

const output = file => {
	return {
		name: 'AuthorElement',
		file: `${outdir}/${file}`,
		format,
		banner,
		sourcemap: true
	}
}

export default [
	// Standard (Minified ES6)
	{
		input,
		plugins: [
			terser()
		],
		output: [
			output('author-element.min.js')
		]
	},

	// Legacy (Transpiled & Minified ES5)
	{
		input,
		plugins: [
			buble(),
			uglify()
		],
		output: [
			output('author-element.es5.min.js')
		]
	},

	// Development: Standard (Unminified ES6)
	{
		input,
		plugins: [],
		output: [
			output('author-element.js')
		]
	},

	// Development: Legacy (Transpiled & Unminified ES5)
	{
		input,
		plugins: [
			buble()
		],
		output: [
			output('author-element.es5.js')
		]
	}
]
