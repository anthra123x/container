import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (process.env.NODE_ENV === "production") {
      console.log("[Web Vitals]", JSON.stringify(body))
    }
    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 400 })
  }
}
