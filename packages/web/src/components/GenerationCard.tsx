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
			className="p-1 transition-colors border border-black rounded-lg cursor-pointer lg:p-2 bg-gradient-to-r from-green-400 via-red-400 to-blue-400 hover:border-zinc-500 hover:brightness-105"
			onClick={() => navigate(routes.pokemonList(generation.name))}
		>
			<div className="flex flex-col items-center bg-white border border-black rounded-lg">
				<p className="w-full font-bold text-white bg-black rounded-t-md">
					{generation.displayName}
				</p>
				<div className="grid grid-flow-col gap-2 p-2">
					{generation.starters.map((starter, index, array) => (
						<Fragment key={starter.name}>
							<Sprite name={starter.name} imgSrc={starter.sprite} />
							{index < array.length - 1 && <div className="w-px h-full bg-zinc-200" />}
						</Fragment>
					))}
				</div>
			</div>
		</button>
	);
}
