import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { ENV } from './config';
import { Router } from './Router';

import './index.css';

Sentry.init({
	dsn: ENV.VITE_SENTRY_DSN,
	integrations: [Sentry.browserTracingIntegration()],
	tracesSampleRate: 1,
});

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>,
);
