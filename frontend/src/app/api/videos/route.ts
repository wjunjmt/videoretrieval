import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/videos`;

    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend error:", errorText);
      return NextResponse.json({ message: 'Error from backend service' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
