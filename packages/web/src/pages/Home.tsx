import { useLoaderData, useNavigate } from 'react-router-dom';

import { Button, GenerationCard } from '../components';
import { routes } from '../config';
import { Generation } from '../services';

export function Home() {
	const navigate = useNavigate();
	const generations = useLoaderData() as Generation[];

	return (
		<div className="flex flex-col items-center gap-5 overflow-auto">
			<img src="images/pokemon-logo.png" alt="Pokémon logo" className="w-80" />
			<Button onClick={() => navigate(routes.search())}>SEARCH ALL</Button>
			<div className="grid gap-2 lg:grid-cols-3 lg:gap-6">
				{generations.map(generation => (
					<GenerationCard key={generation.name} generation={generation} />
				))}
			</div>
		</div>
	);
}
