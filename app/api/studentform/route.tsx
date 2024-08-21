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

function formatToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
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
      extraPractice,
    } = await request.json();

    // Ensure the date is stored in DD/MM/YYYY format
    const formattedDate = formatToDDMMYYYY(new Date(date));
    const joiningdate = formatToDDMMYYYY(new Date()); // Store current date in DD/MM/YYYY format

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
      date: formattedDate,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice,
      joiningdate,
    });

    const response = NextResponse.json(
      { message: "Student form created", data: newStudentForm },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create student form:", error);
    const response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

export async function GET() {
  try {
    await connectDB();
    const studentforms = await studentformModel.find();

    const response = NextResponse.json({ studentforms }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get student forms:", error);
    const response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
