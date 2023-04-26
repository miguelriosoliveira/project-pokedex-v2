import react from '@vitejs/plugin-react';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		Unfonts({
			google: {
				families: [{ name: 'Roboto', styles: 'wght@400;500;700' }],
			},
		}),
	],
});
