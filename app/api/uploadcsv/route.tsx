import studentformModel from "@/models/studentform";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";
import { parse } from "papaparse";
import dayjs from "dayjs";

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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const reader = file.stream().getReader();
    let decoder = new TextDecoder("utf-8");
    let csvContent = "";

    let done, value;
    while (!done) {
      ({ done, value } = await reader.read());
      if (value) {
        csvContent += decoder.decode(value);
      }
    }

    const { data, errors } = parse(csvContent, { header: true });
    if (errors.length > 0) {
      console.error("CSV Parsing errors:", errors);
      return NextResponse.json(
        { message: "Error parsing CSV file" },
        { status: 400 }
      );
    }

    // Remove id field and convert keys to lowercase, and set default joiningdate if missing
    const filteredData = data.map((row) => {
      const { id, ...rest } = row;
      const lowerCaseRow = {};
      for (const key in rest) {
        lowerCaseRow[key.toLowerCase()] = rest[key];
      }

      // Handle the date of birth parsing (assume it's in MM/DD/YYYY format)
      if (lowerCaseRow['date']) {
        const parsedDate = dayjs(lowerCaseRow['date'], 'MM/DD/YYYY');
        lowerCaseRow['date'] = parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : "Invalid Date";
      }

      // Handle the joiningdate parsing (assume it's in MM/DD/YYYY format)
      if (!lowerCaseRow['joiningdate']) {
        lowerCaseRow['joiningdate'] = dayjs().format('DD/MM/YYYY');
      } else {
        const parsedJoiningDate = dayjs(lowerCaseRow['joiningdate'], 'MM/DD/YYYY');
        lowerCaseRow['joiningdate'] = parsedJoiningDate.isValid() ? parsedJoiningDate.format('DD/MM/YYYY') : "Invalid Date";
      }

      return lowerCaseRow;
    });

    await connectDB();
    const newStudentForms = await studentformModel.insertMany(filteredData);

    console.log("Uploaded and created student forms:", newStudentForms);

    let response = NextResponse.json(
      {
        message: "CSV uploaded and student forms created",
        importedCount: newStudentForms.length,
      },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to upload and process CSV file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export default async function handler(req: Request) {
  if (req.method === "POST") {
    return POST(req);
  } else if (req.method === "OPTIONS") {
    return OPTIONS();
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
