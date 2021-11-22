/**
 * @type {import("snowpack").SnowpackUserConfig }
 *
 * This is the Snowpack configuration file
 */
module.exports = {
	alias: {
		'safer-buffer': 'buffer'
	},
	mount: {
		public: { url: '/', static: true },
		src: { url: '/dist' }
	},
	plugins: [
		'@snowpack/plugin-react-refresh',
		'@snowpack/plugin-dotenv',
		/** Enabling Webpack is recommended by Snowpack for production */
		// '@snowpack/plugin-webpack',
		[
			'@snowpack/plugin-typescript',
			{
				/* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
				...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {})
			}
		]
	],
	routes: [
		/* Enable an SPA Fallback in development: */
		// {"match": "routes", "src": ".*", "dest": "/index.html"},
	],
	/**
	 * Using Snowpack's optimize options for building:
	 * https://www.snowpack.dev/guides/optimize-and-bundle#option-1-built-in-optimizations
	 */
	optimize: {
		bundle: true,
		minify: true
	},
	packageOptions: {
		polyfillNode: true
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {
		// Enable source maps for coverage
		sourcemap: true,
		// put the meta snowpack build files under snowpack instead of _snowpack since Github special-cases underscore prefixed folders
		metaUrlPath: 'snowpack'
	}
};
