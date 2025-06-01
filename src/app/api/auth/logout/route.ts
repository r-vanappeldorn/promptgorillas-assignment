import { getAuthSession } from '@/utils/session';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await getAuthSession();
  session.destroy();

  return NextResponse.json({ message: 'session unset' }, { status: 200 });
}

export async function GET() {
  const session = await getAuthSession();
  session.destroy();

  return NextResponse.json({ message: 'session unset' }, { status: 200 });
}
