// /app/api/event/route.ts

import connectDB from "@/config/database";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

// Set CORS headers
async function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST request to create a new event
export async function POST(request) {
  try {
    const {
      campLocation,
      campName,
      campNote,
      date,
      eventType,
      time,
      traineeIds,
    } = await request.json();

    await connectDB();

    const newEvent = new Event({
      campLocation,
      campName,
      campNote,
      date,
      eventType,
      time,
      traineeIds,
    });

    const savedEvent = await newEvent.save();
    console.log("Saved event:", savedEvent);

    let response = NextResponse.json(
      { message: "Event Created", event: savedEvent },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// Handle GET request to fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find();

    let response = NextResponse.json({ events });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get events:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
