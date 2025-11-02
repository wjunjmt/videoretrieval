import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { frame_id: string } }) {
  const frame_id = params.frame_id;
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/frames/${frame_id}/analyze`;
    const backendResponse = await fetch(backendUrl, { method: 'POST' });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json({ message: 'Error from backend service', error: errorText }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`API route error for /frames/${frame_id}/analyze:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
