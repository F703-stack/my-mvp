// app/api/chat/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  console.log("[POST] /api/chat invoked");
  try {
    const body = await req.json();
    console.log("Request body:", body);

    if (!body || !Array.isArray(body.messages)) {
      console.warn("Invalid request: 'messages' missing or not an array");
      return NextResponse.json(
        { error: "'messages' field is required and must be an array." },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: body.messages,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
        },
      }
    );

    console.log("OpenRouter API response:", response.data);
    return NextResponse.json(response.data, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const isDev = process.env.NODE_ENV !== "production";
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = isDev ? {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      response: (error as { response?: { data?: unknown } })?.response?.data
    } : undefined;
    
    return NextResponse.json(
      {
        error: "Something went wrong",
        ...(errorDetails && { details: errorDetails }),
      },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}