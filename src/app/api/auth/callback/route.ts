import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/utils/session';
import { getEnv } from '@/utils/env';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const { clientId, clientSecret, redirectUri, baseUrl } = getEnv();
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const session = await getAuthSession();
    session.tokens = {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };
    await session.save();

    return NextResponse.redirect(baseUrl);
  } catch (error) {
    console.error('Error exchanging code:', error);
    return NextResponse.json(
      { error: 'Failed to exchange code for tokens' },
      { status: 500 },
    );
  }
}
