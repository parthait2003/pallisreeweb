import connectDB from "@/config/database";
import Report from "@/models/reports";
import { NextResponse } from "next/server";

async function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function GET(request) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await connectDB();
    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json({ report });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get report:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const {
      date,
      expense,
      income,
      noOfNewTraineeCricket,
      noOfNewTraineeFootball,
      noOfNewClubMember,
      profitAndLoss,
    } = await request.json();

    await connectDB();
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        date,
        expense,
        income,
        noOfNewTraineeCricket,
        noOfNewTraineeFootball,
        noOfNewClubMember,
        profitAndLoss,
      },
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json({
      message: "Report Updated",
      updatedReport,
    });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update report:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    await connectDB();
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Report Deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete report:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
