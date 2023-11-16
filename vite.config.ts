import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import packageJson from './package.json';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
	plugins: [react(), viteTsconfigPaths(), svgrPlugin(), nodePolyfills()],
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
	}
});
