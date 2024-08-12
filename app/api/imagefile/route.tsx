import { NextRequest, NextResponse } from "next/server";

// Handling GET and POST requests in route.tsx
export async function GET(request: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "World";

  // Create a response
  return NextResponse.json({ message: `Hello, ${name}!` });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { url } = data;

    if (!url) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return NextResponse.json({ exists: true }, { status: 200 });
      } else {
        return NextResponse.json({ exists: false }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ exists: false }, { status: 500 });
    }
  } catch (error) {
    // Handle error
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
