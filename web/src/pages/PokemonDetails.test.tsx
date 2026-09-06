import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { PokemonDetails } from './PokemonDetails';

const threeVariants = {
	name: 'Tyrogue',
	number: 236,
	types: ['fighting'],
	description: 'desc',
	sprite: 'tyrogue.png',
	weaknesses: [],
	evolution_chain: {
		common: [
			{
				display_name: 'Tyrogue',
				number: 236,
				sprite: 'tyrogue.png',
				types: ['fighting'],
			},
		],
		variant: [
			{
				display_name: 'Hitmonlee',
				number: 106,
				sprite: 'hitmonlee.png',
				types: ['fighting'],
			},
			{
				display_name: 'Hitmonchan',
				number: 107,
				sprite: 'hitmonchan.png',
				types: ['fighting'],
			},
			{
				display_name: 'Hitmontop',
				number: 237,
				sprite: 'hitmontop.png',
				types: ['fighting'],
			},
		],
	},
};

function renderDetails(pokemon: typeof threeVariants) {
	const router = createMemoryRouter(
		[
			{
				path: '/pokemon/:pokemonId',
				loader: () => pokemon,
				element: <PokemonDetails />,
			},
		],
		{ initialEntries: ['/pokemon/236'] },
	);

	return render(<RouterProvider router={router} />);
}

describe('PokemonDetails', () => {
	it('shows every branched evolution', async () => {
		renderDetails(threeVariants);

		expect(await screen.findByText(/Hitmonlee/i)).toBeInTheDocument();
		expect(screen.getByText(/Hitmonchan/i)).toBeInTheDocument();
		expect(screen.getByText(/Hitmontop/i)).toBeInTheDocument();
	});
});
