import connectDB from "@/config/database";
import { NextResponse, NextRequest } from "next/server";
import settingsModel from "@/models/settings";

// Function to connect to the database
const connectDb = async () => {
  await connectDB();
};

// Handle GET request to fetch settings by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDb();

  try {
    const settings = await settingsModel.findById(id);
    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// Handle PUT request to update settings by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDb();

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const {
      regularmonthlyfee,
      extrapractice,
      membershipfee,
      gymfee,
      developementfee,
      admissionfee,
      couches,
      trainees, // Include trainees from the request body
    } = body;

    const date = new Date(); // Add the current date

    let settings = await settingsModel.findById(id);
    if (settings) {
      // Update existing settings
      settings.regularmonthlyfee = regularmonthlyfee;
      settings.extrapractice = extrapractice;
      settings.membershipfee = membershipfee;
      settings.gymfee = gymfee;
      settings.developementfee = developementfee;
      settings.admissionfee = admissionfee;

      // Update couches
      settings.couches = couches.map((couch: any) => ({
        name: couch.name,
        fee: couch.fee,
        mobile: couch.mobile,
        designation: couch.designation,
        _id: couch._id, // Maintain the same couch ID
      }));

      // Update trainees, including extraPracticePayment
      settings.trainees = trainees.map((trainee: any) => ({
        type: trainee.type,
        payment: trainee.payment,
        extraPracticePayment: trainee.extraPracticePayment, // Ensure this field is updated
        _id: trainee._id, // Maintain the same trainee ID (if provided)
      }));

      settings.date = date; // Update the date
      await settings.save();
    } else {
      // Create new settings if not found
      settings = new settingsModel({
        _id: id, // Ensure the ID matches the provided ID
        regularmonthlyfee,
        extrapractice,
        membershipfee,
        gymfee,
        developementfee,
        admissionfee,
        couches: couches.map((couch: any) => ({
          name: couch.name,
          fee: couch.fee,
          mobile: couch.mobile,
          designation: couch.designation,
          _id: couch._id,
        })),
        trainees: trainees.map((trainee: any) => ({
          type: trainee.type,
          payment: trainee.payment,
          extraPracticePayment: trainee.extraPracticePayment, // Ensure this field is created
          _id: trainee._id,
        })),
        date, // Set the date
      });
      await settings.save();
    }

    return NextResponse.json(
      { message: "Settings updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Error updating data" }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
