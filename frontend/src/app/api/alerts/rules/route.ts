import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/alerts/rules`;
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const backendUrl = `${process.env.BACKEND_API_URL}/alerts/rules`;
        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!backendResponse.ok) {
            return NextResponse.json({ message: 'Error from backend' }, { status: backendResponse.status });
        }
        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
