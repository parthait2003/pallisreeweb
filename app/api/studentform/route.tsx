import studentformModel from "@/models/studentform";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function POST(request: Request) {
  try {
    const {
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno,
      date,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice, // Nouveau champ ajouté
    } = await request.json();

    console.log("Received payload:", {
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno,
      date,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice, // Nouveau champ ajouté
    });

    await connectDB();
    const newStudentForm = await studentformModel.create({
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno,
      date,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice, // Nouveau champ ajouté
    });

    console.log("Created student form:", newStudentForm);

    let response = NextResponse.json(
      { message: "Student form created" },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create student form:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const studentforms = await studentformModel.find();

    let response = NextResponse.json({ studentforms });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get student forms:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
