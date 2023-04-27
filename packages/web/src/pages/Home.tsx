import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, GenerationCard } from '../components';
import { routes } from '../config';
import { Generation, api } from '../services';
import { logger } from '../utils';

export function Home() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [errorMsg, setErrorMsg] = useState('');

	// TODO: Move it to SSR
	useEffect(() => {
		async function getGenerations() {
			setLoading(true);
			try {
				const genList = await api.getGenerations();
				setGenerations(genList);
			} catch (error) {
				const axiosError = error as AxiosError;
				if (!axiosError.response) {
					setErrorMsg('Our servers are in maintenance time, please check back later!');
				}
				logger.error(error, 'Failed getting generations');
				return;
			} finally {
				setLoading(false);
			}
		}

		getGenerations();
	}, []);

	return (
		<div className="flex flex-col items-center gap-5 overflow-auto">
			<img src="images/pokemon-logo.png" alt="Pokémon logo" className="w-80" />

			{loading ? (
				<img src="images/pokeball-spinning.webp" alt="Pokéball spinning serving as loading icon" />
			) : errorMsg ? (
				<h6 className="p-6 bg-white border-2 border-black rounded-lg">{errorMsg}</h6>
			) : (
				<>
					<Button onClick={() => navigate(routes.search())}>SEARCH ALL</Button>
					<div className="grid grid-cols-3 gap-6">
						{generations.map(generation => (
							<GenerationCard key={generation.name} generation={generation} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
