import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Event from "@/models/event";

// Set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST request to create a new event
export async function POST(request: Request) {
  try {
    // Parse the request body to get event data
    const { traineeIds, eventType, ...eventData } = await request.json();

    await connectDB(); // Connect to MongoDB

    // Prepare the event object based on the event type
    let newEvent;
    switch (eventType) {
      case "Camp":
        newEvent = new Event({
          ...eventData, // campName, campLocation, date, time, campNote
          eventType,
          traineeIds,
        });
        break;

      case "Tournament":
        newEvent = new Event({
          ...eventData, // tournamentName, tournamentLocation, date, time, tournamentNote
          eventType,
          traineeIds,
        });
        break;

      case "Notice":
        newEvent = new Event({
          ...eventData, // noticeTitle, noticeDesc, date, time, assignedBy
          eventType,
          traineeIds,
        });
        break;

      default:
        return NextResponse.json(
          { message: "Invalid event type" },
          { status: 400 }
        );
    }

    // Save the event to the database
    const savedEvent = await newEvent.save();

    // Return the saved event as the response
    let response = NextResponse.json(savedEvent, { status: 201 });
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
    await connectDB(); // Connect to MongoDB

    // Fetch all events from the database
    const events = await Event.find({});

    // Return the events as the response
    let response = NextResponse.json(events, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
