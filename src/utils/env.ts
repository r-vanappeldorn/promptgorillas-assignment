function getEnv() {
  const isClient = typeof window !== 'undefined';
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const sessionPassword = process.env.SESSION_PASSWORD;

  if (typeof clientId === 'undefined' || clientId === '') {
    throw Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
  }

  if (typeof redirectUri === 'undefined' || redirectUri === '') {
    throw Error('NEXT_PUBLIC_GOOGLE_REDIRECT_URI is not set');
  }

  if (typeof baseUrl === 'undefined' || baseUrl === '') {
    throw Error('NEXT_PUBLIC_BASE_URL is not set');
  }

  if (
    (typeof clientSecret === 'undefined' || clientSecret === '') &&
    !isClient
  ) {
    throw Error('GOOGLE_CLIENT_SECRET is not set');
  }

  if (
    (typeof sessionPassword === 'undefined' || sessionPassword === '') &&
    !isClient
  ) {
    throw Error('SESSION_PASSWORD is not set');
  }

  return { clientId, clientSecret, redirectUri, baseUrl, sessionPassword };
}

export { getEnv };
