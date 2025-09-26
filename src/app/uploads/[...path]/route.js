import { NextResponse } from 'next/server';

// Always use HTTPS port 5443 since that's where your backend is running
const BACKEND_URL = 'https://localhost:5443';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const url = `${BACKEND_URL}/uploads/${path.join('/')}`;

    // In production, disable SSL verification for internal calls
    if (process.env.NODE_ENV === 'production') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse('File not found', { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Upload Proxy Error:', error);
    return new NextResponse('Service unavailable', { status: 503 });
  }
}