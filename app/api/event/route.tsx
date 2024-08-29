import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '@/config/database';
import Event from '@/models/event';

// Configure the S3 client for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: 'https://blr1.digitaloceanspaces.com',
  region: 'blr1',
  credentials: {
    accessKeyId: 'DO00ZKVH67MAVWTMY433',
    secretAccessKey: 'kvXOFmo6fiJqNv/klNVZsMk7sCDxFhsE8CuMEg6uDE0',
  },
});

// Set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
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
      case 'Camp':
        newEvent = new Event({
          ...eventData, // campName, campLocation, date, time, campNote
          eventType,
          traineeIds,
        });
        break;

      case 'Tournament':
        newEvent = new Event({
          ...eventData, // tournamentName, tournamentLocation, date, time, tournamentNote
          eventType,
          traineeIds,
        });
        break;

      case 'Notice':
        newEvent = new Event({
          ...eventData, // noticeTitle, noticeDesc, date, time, assignedBy
          eventType,
          traineeIds,
        });
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid event type' },
          { status: 400 }
        );
    }

    // Save the event to the database
    const savedEvent = await newEvent.save();

    // Handle PDF generation and upload if event type is "Camp"
    let pdfUrl = null;
    if (eventType === 'Camp') {
      const doc = new jsPDF();

      doc.text('Camp Details:', 10, 10);
      doc.text(`Camp Location: ${eventData.campLocation}`, 10, 20);
      doc.text(`Camp Name: ${eventData.campName}`, 10, 30);
      doc.text(`Camp Note: ${eventData.campNote || 'N/A'}`, 10, 40);
      doc.text(`Date: ${new Date(eventData.date).toLocaleDateString()}`, 10, 50);
      doc.text(`Time: ${new Date(eventData.time).toLocaleTimeString()}`, 10, 60);
      doc.text(`Trainee IDs: ${traineeIds.join(', ')}`, 10, 70);

      // Get the PDF as a binary string
      const pdfBytes = doc.output('arraybuffer');

      // Upload the PDF to DigitalOcean Spaces
      const uploadParams = {
        Bucket: 'pallisree', // Replace with your actual Space name
        Key: `events/${savedEvent._id}.pdf`, // Example file name
        Body: pdfBytes,
        ContentType: 'application/pdf',
        ACL: 'public-read', // Make the file publicly readable (optional)
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      pdfUrl = `https://${uploadParams.Bucket}.blr1.digitaloceanspaces.com/${uploadParams.Key}`;
    }

    const responsePayload = { message: 'Event Created', savedEvent };
    if (pdfUrl) {
      responsePayload['pdfUrl'] = pdfUrl;
    }

    let response = NextResponse.json(responsePayload, { status: 201 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
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
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
