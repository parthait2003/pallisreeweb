import connectDB from "@/config/database";
import staffpaymentModel from "@/models/staffpayment";
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
  const {
    staffName,
    otherCoach,
    date,
    amount,
    things,
    monthsSelected,
    billNo, // Added billNo field
    year, // Added year field
  } = await request.json();

  await connectDB();
  const updatedExpenditure = await staffpaymentModel.findByIdAndUpdate(
    id,
    {
      staffName,
      otherCoach,
      date,
      amount,
      things,
      months: monthsSelected,
      billNo, // Include billNo field
      year, // Include year field
    },
    { new: true }
  );

  let response = NextResponse.json(
    { message: "Staff Payment updated" },
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
  const expenditure = await staffpaymentModel.findOne({ _id: id });

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
    const deletedExpenditure = await staffpaymentModel.findByIdAndDelete(id);

    if (!deletedExpenditure) {
      let response = NextResponse.json(
        { message: "Staff Payment not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    console.log("Deleted staff payment:", deletedExpenditure);

    let response = NextResponse.json(
      { message: "Staff Payment deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete staff payment:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
