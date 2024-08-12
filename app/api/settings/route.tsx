import connectDB from "@/config/database";
import { NextResponse, NextRequest } from "next/server";
import settingsModel from "@/models/settings";

// Function to connect to the database
const connectDb = async () => {
  await connectDB();
};

// Handle GET request to fetch settings
export async function GET(req: NextRequest) {
  await connectDb();

  try {
    const settings = await settingsModel.findOne();
    const response = NextResponse.json(settings, { status: 200 });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// Handle POST request to save settings
export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const {
      settings: {
        monthlyFee,
        extraPracticeFee,
        membershipFee,
        gymFee,
        developmentFee,
        admissionFee,
      },
      couches,
    } = body;

    const date = new Date(); // Add the current date

    let settings = await settingsModel.findOne();
    if (settings) {
      // Update existing settings
      settings.regularmonthlyfee = monthlyFee;
      settings.extrapractice = extraPracticeFee;
      settings.membershipfee = membershipFee;
      settings.gymfee = gymFee;
      settings.developementfee = developmentFee;
      settings.admissionfee = admissionFee;
      settings.couches = couches.map((couch: any) => ({
        name: couch.name,
        fee: couch.fee,
        mobile: couch.mobile,
        designation: couch.designation,
      }));
      settings.date = date; // Update the date
      await settings.save();
    } else {
      // Create new settings
      settings = new settingsModel({
        regularmonthlyfee: monthlyFee,
        extrapractice: extraPracticeFee,
        membershipfee: membershipFee,
        gymfee: gymFee,
        developementfee: developmentFee,
        admissionfee: admissionFee,
        couches: couches.map((couch: any) => ({
          name: couch.name,
          fee: couch.fee,
          mobile: couch.mobile,
          designation: couch.designation,
        })),
        date, // Set the date
      });
      await settings.save();
    }

    return NextResponse.json({ message: "Settings saved!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Error saving data" }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
