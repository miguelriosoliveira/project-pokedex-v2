import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '../config';
import { Generation } from '../services';

import { Sprite } from './Sprite';

interface Props {
	generation: Generation;
}

export function GenerationCard({ generation }: Props) {
	const navigate = useNavigate();

	return (
		<button
			key={generation.name}
			type="button"
			className="cursor-pointer rounded-lg border border-black bg-gradient-to-r from-green-400 via-red-400 to-blue-400 p-1 transition-colors hover:border-zinc-500 hover:brightness-105 lg:p-2"
			onClick={() => navigate(routes.pokemonList(generation.name))}
		>
			<div className="flex flex-col items-center rounded-lg border border-black bg-white">
				<p className="w-full rounded-t-md bg-black font-bold text-white">
					{generation.displayName}
				</p>
				<div className="grid grid-flow-col gap-2 p-2">
					{generation.starters.map((starter, index, array) => (
						<Fragment key={starter.name}>
							<Sprite name={starter.name} imgSrc={starter.sprite} />
							{index < array.length - 1 && <div className="h-full w-px bg-zinc-200" />}
						</Fragment>
					))}
				</div>
			</div>
		</button>
	);
}
