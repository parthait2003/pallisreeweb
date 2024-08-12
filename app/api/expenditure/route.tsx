import expenditureModel from "@/models/expenditure";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
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
    const { expenditures, description, date, amount, document, things } =
      await request.json();

    await connectDB();
    const newExpenditure = await expenditureModel.create({
      expenditures,
      description,
      date,
      amount,
      document,
      things, // Include the new field
    });

    let response = NextResponse.json(
      { message: "Expenditure Created" },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create expenditure:", error);
    let response = NextResponse.json(
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
    const expenditures = await expenditureModel.find();

    let response = NextResponse.json({ expenditures }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get expenditures:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
