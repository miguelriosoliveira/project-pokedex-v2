import react from '@vitejs/plugin-react';
import Unfonts from 'unplugin-fonts';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		Unfonts.vite({
			google: {
				families: [{ name: 'Roboto', styles: 'wght@400;500;700' }],
			},
		}),
	],
});
