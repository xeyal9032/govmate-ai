'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import './global-error.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="ge-root">
          <div className="ge-inner">
            <h2 className="ge-title">Something went wrong</h2>
            <button type="button" onClick={reset} className="ge-button">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
