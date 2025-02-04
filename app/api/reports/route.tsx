import connectDB from "@/config/database";
import Report from "@/models/reports";
import { NextResponse } from "next/server";

async function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return setCORSHeaders(response);
}

export async function POST(request) {
  try {
    const {
      date,
      expense = 0,
      income = 0,
      noOfNewTraineeCricket = 0,
      noOfNewTraineeFootball = 0,
      noOfNewClubMember = 0,
    } = await request.json();

    if (!date) {
      throw new Error("Date is required");
    }

    const expenseNumber = Number(expense);
    const incomeNumber = Number(income);
    const noOfNewTraineeCricketNumber = Number(noOfNewTraineeCricket);
    const noOfNewTraineeFootballNumber = Number(noOfNewTraineeFootball);
    const noOfNewClubMemberNumber = Number(noOfNewClubMember);

    await connectDB();

    const existingReport = await Report.findOne({ date });

    if (existingReport) {
      existingReport.expense += expenseNumber;
      existingReport.income += incomeNumber;
      existingReport.noOfNewTraineeCricket += noOfNewTraineeCricketNumber;
      existingReport.noOfNewTraineeFootball += noOfNewTraineeFootballNumber;
      existingReport.noOfNewClubMember += noOfNewClubMemberNumber;
      existingReport.profitAndLoss =
        existingReport.income - existingReport.expense;

      await existingReport.save();

      const response = NextResponse.json(
        { message: "Report Updated", report: existingReport },
        { status: 200 }
      );
      return setCORSHeaders(response);
    } else {
      const newReport = new Report({
        date,
        expense: expenseNumber,
        income: incomeNumber,
        noOfNewTraineeCricket: noOfNewTraineeCricketNumber,
        noOfNewTraineeFootball: noOfNewTraineeFootballNumber,
        noOfNewClubMember: noOfNewClubMemberNumber,
        profitAndLoss: incomeNumber - expenseNumber,
      });

      const savedReport = await newReport.save();

      const response = NextResponse.json(
        { message: "Report Created", report: savedReport },
        { status: 201 }
      );
      return setCORSHeaders(response);
    }
  } catch (error) {
    console.error("Failed to create/update report:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
function convertToISODate(dateString: string): string {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}
// Handle GET request to fetch reports, optionally filtered by date
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    console.log("GET" + date);
    let query = {};

    if (date) {
      query = {
        date: convertToISODate(date),
      };
    }
    console.log("GET query:", query);

    const reports = await Report.find(query);

    const response = NextResponse.json({ reports }, { status: 200 });
    return setCORSHeaders(response);
  } catch (error) {
    console.error("Failed to get reports:", error);
    const response = NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}
