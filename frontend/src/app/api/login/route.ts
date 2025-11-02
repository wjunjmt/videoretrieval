import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const backendUrl = `${process.env.BACKEND_API_URL}/token`;

    // FastAPI's OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ message: 'Authentication failed' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("API route error for /login:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
