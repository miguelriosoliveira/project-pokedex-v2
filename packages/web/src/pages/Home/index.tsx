import { Button, Divider, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sprite } from '../../components';
import { routes } from '../../config';
import { api, Generation } from '../../services';
import { logger } from '../../utils';

import styles from './styles.module.scss';

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
		<div className={styles['home-component']}>
			<img src="images/pokemon-logo.png" alt="Pokémon logo" className={styles.logo} />

			{loading ? (
				<img src="images/pokeball-spinning.webp" alt="Pokéball spinning serving as loading icon" />
			) : errorMsg ? (
				<div className="maintenance">
					<Typography variant="h6">{errorMsg}</Typography>
				</div>
			) : (
				<>
					<Button variant="contained" color="primary" onClick={() => navigate(routes.search())}>
						Search all
					</Button>

					<div className="generations">
						{generations.map(gen => (
							<button
								key={gen.name}
								type="button"
								className="generation-wrap"
								onClick={() => navigate(routes.pokemonList(gen.name))}
							>
								<div className="generation-card">
									<Typography variant="body1" className="generation-name">
										{gen.displayName}
									</Typography>
									<div className="starters">
										{gen.starters.map((starter, index, array) => (
											<Fragment key={starter.name}>
												<Sprite name={starter.name} imgSrc={starter.sprite} />
												{index < array.length - 1 && <Divider orientation="vertical" flexItem />}
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
