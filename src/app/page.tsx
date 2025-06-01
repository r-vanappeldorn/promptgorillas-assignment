import SignedIn from '@/components/SignedIn';
import { Login } from '@/components/login';
import { getAuthSession } from '@/utils/session';

export default async function Home() {
  const session = await getAuthSession();

  if (!session.tokens) {
    return <Login />;
  }

  return <SignedIn access_token={session.tokens.access_token} />;
}
