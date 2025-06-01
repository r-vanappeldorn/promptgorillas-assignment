import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { getEnv } from './env';

type SessionData = {
  tokens?: {
    access_token: string;
    refresh_token?: string | null;
    expiry_date?: number | null;
  };
};

async function getAuthSession() {
  const { sessionPassword } = getEnv();
  const sessionOptions: SessionOptions = {
    password: sessionPassword!,
    cookieName: 'session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  };

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  return session;
}

export type { SessionData };

export { getAuthSession };
