import { Fragment } from 'react';
import { FaCaretRight } from 'react-icons/fa';

import type { Pokemon } from '../services';

import { PokemonCard } from './PokemonCard';

interface Props {
	common: Pokemon[];
	variants: Pokemon[][];
}

const cardClass = 'w-44 shrink-0';

function ForkConnector() {
	return (
		<div className="flex w-6 shrink-0 items-center self-stretch" aria-hidden>
			<div className="h-px w-2 bg-black" />
			<div className="my-25 w-4 self-stretch rounded-l-md border-y-2 border-l-2 border-black" />
		</div>
	);
}

function Branch({ pokemons }: { pokemons: Pokemon[] }) {
	return (
		<div className="flex items-center">
			{pokemons.map((poke, index) => (
				<Fragment key={poke.number}>
					{index > 0 && <FaCaretRight className="mx-1 shrink-0" />}
					<PokemonCard pokemon={poke} className={cardClass} />
				</Fragment>
			))}
		</div>
	);
}

export function EvolutionChain({ common, variants }: Props) {
	const compactGrid = variants.length > 3 && variants.every(branch => branch.length === 1);

	return (
		<div className="flex flex-col items-center gap-2">
			<p className="font-bold">EVOLUTION CHAIN</p>

			<div className="flex max-w-full items-center overflow-x-auto pb-2">
				{common.map((poke, index) => (
					<Fragment key={poke.number}>
						<PokemonCard pokemon={poke} className={cardClass} />
						{(index < common.length - 1 || variants.length > 0) && (
							<FaCaretRight className="mx-1 shrink-0" />
						)}
					</Fragment>
				))}

				{variants.length > 0 && (
					<div className="flex items-stretch">
						<ForkConnector />
						<ul
							className={
								compactGrid
									? 'grid grid-cols-2 items-center gap-x-3 gap-y-2'
									: 'flex flex-col justify-center gap-2'
							}
						>
							{variants.map((branch, index) => (
								<li
									key={branch.map(poke => poke.number).join('-')}
									className="flex flex-col items-center gap-1"
								>
									{index > 0 && (
										<span className="text-xs font-bold uppercase tracking-wide text-zinc-700">
											or
										</span>
									)}
									<Branch pokemons={branch} />
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
