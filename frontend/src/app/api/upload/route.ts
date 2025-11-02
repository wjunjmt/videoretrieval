import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file found' }, { status: 400 });
    }

    const backendUrl = `${process.env.BACKEND_API_URL}/videos/upload`;

    // We need to recreate the form data to stream it to the backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData, // Pass FormData directly
    });

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
