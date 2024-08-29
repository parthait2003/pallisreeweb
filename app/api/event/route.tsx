import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "@/config/database";
import Event from "@/models/event";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";

// Configure the S3 client for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "blr1",
  credentials: {
    accessKeyId: "DO00ZKVH67MAVWTMY433",
    secretAccessKey: "kvXOFmo6fiJqNv/klNVZsMk7sCDxFhsE8CuMEg6uDE0",
  },
});

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
    const { traineeIds, eventType, ...eventData } = await request.json();

    await connectDB(); // Connect to MongoDB

    const traineeData = await Promise.all(
      traineeIds.map(async (id) => {
        try {
          const res = await fetch(
            `https://sea-turtle-app-bxscv.ondigitalocean.app/api/studentform/${id}`
          );
          const data = await res.json();

          const trainee = data.student;

          if (!trainee || !trainee.name || !trainee.phoneno || !trainee.date) {
            console.error(`Missing data for trainee ID: ${id}`);
            return null; // Skip this trainee if essential data is missing
          }

          return {
            name: trainee.name || "N/A",
            phoneno: trainee.phoneno?.toString() || "N/A",
            date: trainee.date || "N/A",
          };
        } catch (error) {
          console.error(`Failed to fetch trainee data for ID: ${id}`, error);
          return null; // Skip this trainee on error
        }
      })
    );

    const filteredTraineeData = traineeData.filter(
      (trainee) => trainee !== null
    );

    let newEvent;
    switch (eventType) {
      case "Camp":
      case "Tournament":
      case "Notice":
        newEvent = new Event({
          ...eventData,
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

    const savedEvent = await newEvent.save();

    let pdfUrl = null;
    if (["Camp", "Tournament", "Notice"].includes(eventType)) {
      const doc = new jsPDF();

      // Load and convert the logo to Base64
      const logoPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "logo.png"
      );
      const logoData = fs.readFileSync(logoPath).toString("base64");
      const logoBase64 = `data:image/png;base64,${logoData}`;

      // Add logo to the top-left corner
      doc.addImage(logoBase64, "PNG", 10, 10, 18, 20);

      // Add title and additional text
      doc.setFontSize(22);
      doc.text("PALLISREE", 105, 15, { align: "center" });

      doc.setFontSize(12);
      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.text(additionalText, 105, 25, { align: "center" });

      // Add current date to the top-right corner
      const currentDate = new Date().toLocaleDateString("en-GB");
      doc.text(currentDate, 200, 10, { align: "right" });

      // Add event details based on event type
      switch (eventType) {
        case "Camp":
          doc.text(`Camp Name: ${eventData.campName}`, 15, 60);
          doc.text(`Camp Location: ${eventData.campLocation}`, 15, 65);

          doc.text(`Camp Note: ${eventData.campNote || "N/A"}`, 15, 70);
          break;
        case "Tournament":
          doc.text(
            `Tournament Location: ${eventData.tournamentLocation}`,
            15,
            60
          );
          doc.text(`Tournament Name: ${eventData.tournamentName}`, 15, 65);
          doc.text(`Note: ${eventData.tournamentNote || "N/A"}`, 15, 70);
          break;
        case "Notice":
          doc.text(`Notice Name: ${eventData.noticeName}`, 15, 60);
          doc.text(
            `Notice Description: ${eventData.noticeDesc || "N/A"}`,
            15,
            65
          );
          doc.text(`Assigned By: ${eventData.assignedBy || "N/A"}`, 15, 70);
          break;
      }

      doc.text(
        `Date: ${new Date(eventData.date).toLocaleDateString()}`,
        15,
        75
      );
      doc.text(
        `Time: ${new Date(eventData.time).toLocaleTimeString()}`,
        15,
        80
      );

      // Create table data for the trainees
      const tableData = filteredTraineeData.map((trainee, index) => [
        (index + 1).toString(),
        trainee.name,
        trainee.phoneno,
        trainee.date,
      ]);

      // Add the trainee information table to the PDF
      autoTable(doc, {
        head: [["No", "Name", "Phone No", "DOB"]],
        body: tableData,
        startY: 90,
        theme: "grid",
        headStyles: { fillColor: [22, 127, 226] },
      });

      // Get the PDF as a binary string
      const pdfBytes = doc.output("arraybuffer");

      // Upload the PDF to DigitalOcean Spaces
      const uploadParams = {
        Bucket: "pallisree", // Replace with your actual Space name
        Key: `events/${savedEvent._id}.pdf`, // Example file name
        Body: pdfBytes,
        ContentType: "application/pdf",
        ACL: "public-read", // Make the file publicly readable (optional)
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      pdfUrl = `https://${uploadParams.Bucket}.blr1.digitaloceanspaces.com/${uploadParams.Key}`;
    }

    const responsePayload = {
      message: "Event Created",
      savedEvent,
      ...(pdfUrl && { pdfUrl }),
    };
    let response = NextResponse.json(responsePayload, { status: 201 });
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

    const events = await Event.find({});

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
