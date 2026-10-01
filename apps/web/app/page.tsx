'use client';

import { useEffect, useState } from 'react';
import { getApiOrigin, getApiV1BaseUrl } from '../lib/api-config';

type HealthResponse = { status: string };

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiV1 = getApiV1BaseUrl();
  const apiOrigin = getApiOrigin();

  useEffect(() => {
    fetch(`${apiOrigin}/health`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message));
  }, [apiOrigin]);

  return (
    <main>
      <h1>SAD-ILA — WebApp</h1>
      <p>Hello World: interface Next.js conectada ao ApiBff ({apiV1}).</p>
      <section>
        <h2>Status da API</h2>
        {health && (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        )}
        {error && <p style={{ color: 'crimson' }}>Erro ao chamar API: {error}</p>}
        {!health && !error && <p>Carregando…</p>}
      </section>
    </main>
  );
}
