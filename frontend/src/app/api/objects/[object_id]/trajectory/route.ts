import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { object_id: string } }) {
  const object_id = params.object_id;
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/objects/${object_id}/trajectory`;
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json({ message: 'Error from backend service', error: errorText }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`API route error for /objects/${object_id}/trajectory:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
