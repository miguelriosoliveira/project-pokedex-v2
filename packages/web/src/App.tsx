import { ReactNode } from 'react';

import styles from './App.module.scss';

interface AppProps {
	children: ReactNode;
}

export function App({ children }: AppProps) {
	return <main className={styles['app-component']}>{children}</main>;
}
