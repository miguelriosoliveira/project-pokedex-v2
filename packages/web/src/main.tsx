import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Router } from './Router';

const { VITE_SENTRY_DSN: SENTRY_DSN } = import.meta.env;

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1,
});

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>,
);
