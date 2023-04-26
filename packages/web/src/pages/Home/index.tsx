import { AxiosError } from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sprite } from '../../components';
import { routes } from '../../config';
import { api, Generation } from '../../services';
import { logger } from '../../utils';

export function Home() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [errorMsg, setErrorMsg] = useState('');

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
		<div className="bg-[url('/images/bg.png')] bg-cover h-screen overflow-auto flex flex-col gap-5 items-center p-5">
			<img src="images/pokemon-logo.png" alt="Pokémon logo" className="w-80" />

			{loading ? (
				<img src="images/pokeball-spinning.webp" alt="Pokéball spinning serving as loading icon" />
			) : errorMsg ? (
				<h6 className="p-6 bg-white border-2 border-black rounded-lg">{errorMsg}</h6>
			) : (
				<>
					<button
						type="button"
						onClick={() => navigate(routes.search())}
						className="px-3 py-2 text-sm font-medium text-white transition bg-blue-700 rounded-md shadow hover:shadow-lg hover:bg-blue-800"
					>
						SEARCH ALL
					</button>

					<div className="grid grid-cols-3 gap-6">
						{generations.map(gen => (
							<button
								key={gen.name}
								type="button"
								className="p-2 transition-colors border-2 border-black rounded-lg cursor-pointer bg-gradient-to-r from-green-400 via-red-400 to-blue-400 hover:border-zinc-500 hover:brightness-105"
								onClick={() => navigate(routes.pokemonList(gen.name))}
							>
								<div className="flex flex-col items-center bg-white border border-black rounded-lg">
									<p className="w-full font-bold text-white bg-black rounded-t-md">
										{gen.displayName}
									</p>
									<div className="grid grid-flow-col gap-2 p-2">
										{gen.starters.map((starter, index, array) => (
											<Fragment key={starter.name}>
												<Sprite name={starter.name} imgSrc={starter.sprite} />
												{index < array.length - 1 && <div className="w-px h-full bg-zinc-200" />}
											</Fragment>
										))}
									</div>
								</div>
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
