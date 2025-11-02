import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/videos/${id}`;
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json({ message: 'Error from backend service', error: errorText }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`API route error for /videos/${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
