import { ReactNode } from 'react';

export function App({ children }: { children: ReactNode }) {
	return (
		<main className="h-screen overflow-auto bg-[url('/images/bg.png')] bg-cover p-5">
			<div className="h-full m-auto max-w-screen-lg">{children}</div>
		</main>
	);
}
