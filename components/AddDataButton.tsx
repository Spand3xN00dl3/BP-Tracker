'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/Spinner";

export default function AddDataButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        className="flex-1 rounded-md border border-color1 flex flex-row items-center justify-center gap-2"
        onClick={() => setShowPopup(true)}
      >
        <AddIcon size={24} />
        <p className="font-mono text-lg">Add Data</p>
      </button>

      {showPopup && <Popup handleClose={() => setShowPopup(false)} />}
    </>
  );
}

function Popup({ handleClose }: { handleClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [systolicPressure, setSystolicPressure] = useState(0);
  const [diastolicPressure, setDiastolicPressure] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 10));

  const { data: session } = useSession();
  const router = useRouter();

  const addData = async () => {
    if(!session?.user?.email) return;

    setLoading(true);
    const data = {
      systolic: systolicPressure,
      diastolic: diastolicPressure,
      heartRate,
      date
    };

    const res = await fetch(`/api/readings/${encodeURIComponent(session.user.email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if(res.ok) {
      const data = await res.json();
    } else {
      const data = await res.json();
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-sm z-20">
      <div className="w-100 h-80 border rounded-md bg-white flex flex-col">
        <div className="w-full h-10 bg-[#AAA]/20 flex flex-row items-center">
          <div className="size-10 "/>

          <div className="flex-1">
            <p className="w-full text-center font-mono">Add Data</p>
          </div>

          <div className="size-10 flex items-center justify-center">
            <button onClick={handleClose}>
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-6 pl-8">
          <div className="w-full flex flex-row items-center gap-2">
            <p className="font-mono">Systolic Pressure:</p>
            <input
              className="outline-none border border-[#333]/20 w-20 h-8 px-2"
              type="number"
              value={systolicPressure}
              onChange={(e) => setSystolicPressure(e.target.value ? parseInt(e.target.value) : 0)}
              min={0}
              max={200}
            />
            <p className="font-mono text-[#aaa]">mmHg</p>
          </div>

          <div className="w-full flex flex-row items-center gap-2">
            <p className="font-mono">Diastolic Pressure:</p>
            <input
              className="outline-none border border-[#333]/20 w-20 h-8 px-2"
              type="number"
              value={diastolicPressure}
              onChange={(e) => setDiastolicPressure(e.target.value ? parseInt(e.target.value) : 0)}
              min={0}
              max={200}
            />
            <p className="font-mono text-[#aaa]">mmHg</p>
          </div>

          <div className="w-full flex flex-row items-center gap-2">
            <p className="font-mono">Heart Rate:</p>
            <input
              className="outline-none border border-[#333]/20 w-20 h-8 px-2"
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value ? parseInt(e.target.value) : 0)}
              min={0}
              max={200}
            />
            <p className="font-mono text-[#aaa]">bpm</p>
          </div>

          <div className="w-full flex flex-row items-center gap-2">
            <p className="font-mono">Date:</p>
            <input
              className="h-8 w-32 border border-[#333]/20 px-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              // defaultValue={date}
            />
          </div>
        </div>
        <div className="w-full h-15 flex items-center justify-center">
          <button
            className="w-25 h-10 rounded-full border border-[#6E2594]"
            onClick={() => addData()}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon({ size=12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function AddIcon({ size=12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}