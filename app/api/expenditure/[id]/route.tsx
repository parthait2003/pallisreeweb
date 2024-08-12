import connectDB from "@/config/database";
import Expenditure from "@/models/expenditure";
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { expenditures, description, date, amount, document, things } =
    await request.json();

  await connectDB();
  const updatedExpenditure = await Expenditure.findByIdAndUpdate(
    id,
    {
      expenditures,
      description,
      date,
      amount,
      document,
      things, // Include the new field
    },
    { new: true }
  );

  let response = NextResponse.json(
    { message: "Expenditure updated" },
    { status: 200 }
  );
  setCORSHeaders(response);
  return response;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await connectDB();
  const expenditure = await Expenditure.findOne({ _id: id });

  let response = NextResponse.json({ expenditure }, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const deletedExpenditure = await Expenditure.findByIdAndDelete(id);

    if (!deletedExpenditure) {
      let response = NextResponse.json(
        { message: "Expenditure not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    console.log("Deleted expenditure:", deletedExpenditure);

    let response = NextResponse.json(
      { message: "Expenditure deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete expenditure:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
