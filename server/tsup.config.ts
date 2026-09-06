import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		server: 'src/server.ts',
		'scripts/populateDb': 'src/scripts/populateDb.ts',
	},
	clean: true,
});
