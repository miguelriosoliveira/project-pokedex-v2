import { ReactNode } from 'react';

export function App({ children }: { children: ReactNode }) {
	return <main className="h-screen overflow-auto">{children}</main>;
}
