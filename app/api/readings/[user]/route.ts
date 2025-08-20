import { NextRequest, NextResponse } from "next/server";
import getDB from "@/lib/mongo";

const coll = (await getDB()).collection("readings");

export async function GET(req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: email } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if(!email) {
    return NextResponse.json({ error: "Missing path param email" }, { status: 400 });
  }

  if(date) {
    try {
      const findRes = await coll.findOne({ userEmail: email, date });
      // console.log(`Find Res: ${JSON.stringify(findRes)}`);
      return NextResponse.json({ message: "success", data: findRes });
    } catch(err) {
      // console.log(`Error: ${err}`);
      return NextResponse.json({ error: `DB Error: ${err}` }, { status: 400 });
    }
  }

  try {
    const findRes = await coll.find({ userEmail: email }).toArray();
    // console.log(`Find Res: ${JSON.stringify(findRes)}`);
    return NextResponse.json({ message: "success", data: findRes });
  } catch(err) {
    return NextResponse.json({ error: `DB Error: ${err}` }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: email } = await params;
  const { systolic, diastolic, heartRate, date } = await req.json();

  if(!email) {
    return NextResponse.json({ error: "Missing path param email" }, { status: 400 });
  }

  if(systolic == null || diastolic == null || heartRate == null || !date) {
    return NextResponse.json({ error: "Incomplete data object" }, { status: 400 });
  }

  try {
    const updateRes = await coll.updateOne(
      { userEmail: email, date },
      { "$set": { systolic, diastolic, heartRate } },
      { upsert: true }
    );

    // console.log(`POST Update Res: ${JSON.stringify(updateRes)}`);
    return NextResponse.json({ message: "success", data: updateRes });
  } catch(err) {
    // console.log(`Error: ${err}`);
    return NextResponse.json({ error: `DB Error: ${err}` }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ user: string }> }) {
  const { user: email } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  
  if(!email) {
    return NextResponse.json({ error: "Missing path param email" }, { status: 400 });
  }

  if(!date) {
    return NextResponse.json({ error: "Missing search param date" }, { status: 400 });
  }

  try {
    const deleteRes = await coll.deleteOne({ userEmail: email, date });
    // console.log(`Delete Res: ${JSON.stringify(deleteRes)}`);
    return NextResponse.json({ message: "success", data: deleteRes });
  } catch(err) {
    return NextResponse.json({ error: `DB Error: ${err}` }, { status: 400 });
  }
}
