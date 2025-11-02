import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/alerts`;
    // TODO: Add token to the request header for protected routes
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      return NextResponse.json({ message: 'Error from backend' }, { status: backendResponse.status });
    }
    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
