import { NextRequest, NextResponse } from "next/server";
import getDB from "@/lib/mongo";

const coll = (await getDB()).collection("readings");

export async function GET(req: NextRequest, { params }: { params: { user: string } }) {
  const { user: email } = await params;

  if(!email) {
    return NextResponse.json({ error: "Missing path param email" }, { status: 400 });
  }

  try {
    const findRes = await coll.find({ userEmail: email }).toArray();
    // console.log(`Find Res: ${JSON.stringify(findRes)}`);

    if(!findRes || findRes.length == 0) {
      return NextResponse.json({ message: "no data", data: [] });
    }

    const systolicArr = findRes.map((item) => item.systolic);
    const diastolicArr = findRes.map((item) => item.diastolic);
    const heartRateArr = findRes.map((item) => item.heartRate);
    const dateArr = findRes.map((item) => item.date);

    const metrics = [
      {
        title: "Avg Systolic Pressure (mmHg)",
        value: (systolicArr.reduce((a, b) => a + b, 0) / systolicArr.length).toFixed(2)
      },
      {
        title: "Avg Diastolic Pressure (mmHg)",
        value: (diastolicArr.reduce((a, b) => a + b, 0) / diastolicArr.length).toFixed(2)
      },
      {
        title: "Avg Heart Rate (bpm)",
        value: (heartRateArr.reduce((a, b) => a + b, 0) / heartRateArr.length).toFixed(2)
      },
      {
        title: "Starting Date",
        value: dateArr.reduce((a, b) => a > b ? b : a, "9999-99-99")
      },
      {
        title: "Ending Date",
        value: dateArr.reduce((a, b) => a > b ? a : b, "0000-00-00")
      }
    ];

    return NextResponse.json({ message: "success", data: metrics });
  } catch(err) {
    return NextResponse.json({ error: `DB Error: ${err}` }, { status: 400 });
  }

  // return NextResponse.json({ message: "success" });
}
