import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
	mockGet: vi.fn(),
}));

vi.mock('axios', async importOriginal => {
	const actual = await importOriginal<typeof import('axios')>();
	return {
		...actual,
		default: {
			...actual.default,
			create: () => ({ get: mockGet }),
		},
	};
});

import { ErrorElement } from '../components';
import { Home, homeLoader } from './Home';

function renderHomeRoute() {
	const router = createMemoryRouter(
		[
			{
				path: '/',
				errorElement: <ErrorElement />,
				loader: homeLoader,
				element: <Home />,
			},
		],
		{ initialEntries: ['/'] },
	);

	return render(<RouterProvider router={router} />);
}

describe('Home route', () => {
	beforeEach(() => {
		mockGet.mockReset();
	});

	it('does not show the unexpected-error page when the generations request returns 200 HTML', async () => {
		mockGet.mockResolvedValue({
			data: '<!doctype html><html><body>Vite</body></html>',
			status: 200,
			headers: { 'content-type': 'text/html' },
		});

		renderHomeRoute();

		expect(await screen.findByText(/our servers are in maintenance time/i)).toBeInTheDocument();
		expect(screen.queryByText(/something unexpected happening/i)).not.toBeInTheDocument();
	});
});
