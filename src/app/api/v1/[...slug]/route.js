import { NextResponse } from 'next/server';

// Always use HTTPS port 5443 since that's where your backend is running
const BACKEND_URL = 'https://localhost:5443';

async function proxyRequest(request, method, slug) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const url = `${BACKEND_URL}/api/v1/${slug.join('/')}${queryString ? `?${queryString}` : ''}`;

    let body = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.text();
      } catch (e) {
        // No body to parse
      }
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward Cookie header if present
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const fetchOptions = {
      method: method,
      headers: headers,
      // Don't follow redirects automatically - we want to pass them through
      redirect: 'manual',
    };

    if (body) {
      fetchOptions.body = body;
    }

    // In production, disable SSL verification for internal calls
    if (process.env.NODE_ENV === 'production') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const response = await fetch(url, fetchOptions);

    // Handle redirects by passing them through
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        return NextResponse.redirect(location, response.status);
      }
    }

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Create response with same status
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie headers if present
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    return nextResponse;

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { success: false, message: 'Backend service unavailable', error: error.message },
      { status: 503 }
    );
  }
}

export async function GET(request, { params }) {
  const { slug } = params;
  return proxyRequest(request, 'GET', slug);
}

export async function POST(request, { params }) {
  const { slug } = params;
  return proxyRequest(request, 'POST', slug);
}

export async function PUT(request, { params }) {
  const { slug } = params;
  return proxyRequest(request, 'PUT', slug);
}

export async function DELETE(request, { params }) {
  const { slug } = params;
  return proxyRequest(request, 'DELETE', slug);
}

export async function PATCH(request, { params }) {
  const { slug } = params;
  return proxyRequest(request, 'PATCH', slug);
}