import { connectToDatabase } from '@/lib/database';
import Session from '@/models/session';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;

  if (!session_id) {
    return NextResponse.json(
      { error: 'Not Authorized - No Session Token' },
      { status: 403 }
    );
  }

  try {
    await connectToDatabase();

    await Session.findOneAndDelete({ session_id });

    const response = NextResponse.json({ message: 'Logout Successful' });

    response.cookies.set('sid', '', { maxAge: 0 });

    return response;
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
