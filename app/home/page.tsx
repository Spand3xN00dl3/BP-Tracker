import AddDataButton from "@/components/AddDataButton";
import EditDataButton from "@/components/EditDataButton";
import BloodPressureChart from "@/components/LineGraph";
import Metrics from "@/components/Metrics";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">
      <div className="w-full h-24 flex items-center">
        <p className="font-mono text-text text-3xl">Welcome <span className="text-color1 font-medium">{session?.user?.name}</span></p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col gap-8">
        <DashboardArea />
        <Footer />
      </div>
    </div>
  );
}

function DashboardArea() {
  return (
    <div className="flex-1 min-h-0 flex flex-row gap-8">
      <Metrics />

      <div className="flex-1 border border-[#66339966] rounded-xl">
        <Suspense fallback={<GraphLoading />}>
          <LineGraph />
        </Suspense>
      </div>

      <DataModificationButtons />
    </div>
  );
}

function GraphLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="font-mono text-[#aaa] italic">Loading...</p>
    </div>
  );
}

async function LineGraph() {
  const session = await auth();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/readings/${encodeURIComponent(session?.user?.email || "")}`);

  if(!res.ok) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="font-mono text-red-500">Error Loading Graph Data</p>
      </div>
    );
  }

  type ItemType = {
    "_id": string,
    userEmail: string,
    systolic: number,
    diastolic: number,
    heartRate: number,
    date: string
  };

  const data = await res.json();
  const formattedData = [
    {
      id: "Systolic",
      color: 'hsl(200, 70%, 50%)',
      data: data.data.sort((a: ItemType, b: ItemType) => {
        if(a.date === b.date) return 0;
        return a.date > b.date ? 1 : -1;
      }).map((item: ItemType) => ({
        x: item.date,
        y: item.systolic
      }))
    },
    {
      id: "Diastolic",
      color: 'hsl(10, 70%, 50%)',
      data: data.data.sort((a: ItemType, b: ItemType) => {
        if(a.date === b.date) return 0;
        return a.date > b.date ? 1 : -1;
      }).map((item: ItemType) => ({
        x: item.date,
        y: item.diastolic
      }))
    }
  ];

  return (
    <BloodPressureChart data={formattedData} />
  )
}


function DataModificationButtons() {
  return (
    <div className="w-58 h-full flex flex-col gap-4">
      <AddDataButton />
      <EditDataButton />
    </div>
  );
}

function Footer() {
  return (
    <div className="w-full h-20 flex flex-row items-center border">

    </div>
  );
}
