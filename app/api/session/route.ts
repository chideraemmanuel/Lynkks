import { connectToDatabase } from '@/lib/database';
import Session, { SessionInterface } from '@/models/session';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;

  if (!session_id) {
    return NextResponse.json(
      { error: 'Not Authorized - No Session Token' },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();

    const session = await Session.findOne<SessionInterface>({
      session_id,
    });

    if (!session) {
      const response = NextResponse.json(
        { error: 'Not Authorized - Session Not Found' },
        { status: 403 }
      );

      response.cookies.set('sid', '', { maxAge: 0 });

      return response;
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
