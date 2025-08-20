'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Metrics() {
  const [data, setData] = useState([
    {
      title: "Highest Systolic Pressure (mmHg)",
      value: 120
    },
    {
      title: "Avg Diastolic Pressure (mmHg)",
      value: 80
    },
    {
      title: "Avg Blood Pressure (bpm)",
      value: 60
    },
    {
      title: "Highest Diastolic Pressure (mmHg)",
      value: 90
    },
    {
      title: "Highest Diastolic Pressure (mmHg)",
      value: 90
    },
    {
      title: "Highest Diastolic Pressure (mmHg)",
      value: 90
    }
  ]);

  const { data: session } = useSession();
  
  useEffect(() => {
    const fetchData = async (email: string) => {
      const res = await fetch(`/api/readings/${encodeURIComponent(email)}/metrics`);

      if(res.ok) {
        const resData = await res.json();
        setData(resData.data);
      } else {
        const errorData = await res.json();
      }
    };

    if(session?.user?.email) {
      fetchData(session.user.email);
    }
  }, [session?.user?.email]);

  return (
    <div className="w-58 h-full flex flex-col gap-3 overflow-y-auto snap-y">
      {data.map((item, i) => (
        <MetricDataCard key={i} title={item.title} value={item.value} />
      ))}
    </div>
  );
}

function MetricDataCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="snap-start w-full rounded-md border border-color1/60 flex flex-col gap-2 p-2">
      <p className="font-mono text-lg">{title}</p>
      <p className="font-mono text-3xl">{value}</p>
    </div>
  );
}
