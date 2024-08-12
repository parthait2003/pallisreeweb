import connectDB from "@/config/database";
import Student from "@/models/studentform";
import { NextRequest, NextResponse } from "next/server";

async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS, PUT"
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
  try {
    const { id } = params;
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
      extraPractice, // Nouveau champ ajouté
    } = await request.json();

    await connectDB();
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
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
        extraPractice, // Nouveau champ ajouté
      },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Student updated", updatedStudent },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json({ student }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing student ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await Student.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Student deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
