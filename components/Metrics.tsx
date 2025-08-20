'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Metrics() {
  const [data, setData] = useState<MetricType[] | null>(null);

  const { data: session } = useSession();
  
  useEffect(() => {
    const fetchData = async (email: string) => {
      const res = await fetch(`/api/readings/${encodeURIComponent(email)}/metrics`);

      if(res.ok) {
        const resData = await res.json();
        setData(resData.data);
      } else {
        // const errorData = await res.json();
      }
    };

    if(session?.user?.email) {
      fetchData(session.user.email);
    }
  }, [session]);

  if(!data) {
    return (
      <div className="w-58 h-full rounded-md border border-color1 flex items-center justify-center">
        <p className="font-mono text-subtext">Loading...</p>
      </div>
    );
  }

  if(data.length == 0) {
    return (
      <div className="w-58 h-full rounded-md border border-color1 flex items-center justify-center">
        <p className="font-mono">Upload Data to get metrics</p>
      </div>
    );
  }

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

type MetricType = {
  title: string,
  value: string | number
};
