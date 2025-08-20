'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

export default function EditDataButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        className="flex-1 rounded-md border border-color1 flex flex-row items-center justify-center gap-2"
        onClick={() => setShowPopup(true)}
      >
        <EditIcon size={24} />
        <p className="font-mono text-lg">Edit Data</p>
      </button>

      {showPopup && <Popup handleClose={() => setShowPopup(false)} />}
    </>
  );
}

function Popup({ handleClose }: { handleClose: () => void }) {
  const [data, setData] = useState<ItemType | null>(null);
  const { data: session } = useSession();

  const submitDate = async (date: string) => {
    if(!session?.user?.email) return;

    const res = await fetch(`api/readings/${encodeURIComponent(session.user.email)}?date=${encodeURIComponent(date)}`);

    if(res.ok) {
      const resData = await res.json();
      setData(resData.data);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-blur-sm z-20">
      <div className="w-100 rounded-md border border-card-border bg-background flex flex-col">

        <div className="w-full h-10 bg-header flex flex-row items-center rounded-t-md">
          <div className="size-10 "/>

          <div className="flex-1">
            <p className="w-full text-center font-mono">Edit Data</p>
          </div>

          <div className="size-10 flex items-center justify-center">
            <button onClick={handleClose}>
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {data ?
          <EditDataScreen data={data} handleClose={handleClose} /> :
          // <div className="w-full h-20 bg-black" /> :
          <SelectDateScreen submitDate={submitDate} />
        }
      </div>
    </div>
  );
}

function EditDataScreen({ data, handleClose }: { data: ItemType, handleClose: () => void }) {
  const [systolicPressure, setSystolicPressure] = useState(data.systolic);
  const [diastolicPressure, setDiastolicPressure] = useState(data.diastolic);
  const [heartRate, setHeartRate] = useState(data.heartRate);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const updateData = async () => {
    if(!session?.user?.email) return;

    setLoading(true);
    const reqData = {
      systolic: systolicPressure,
      diastolic: diastolicPressure,
      heartRate,
      date: data.date
    };

    const res = await fetch(`/api/readings/${encodeURIComponent(session.user.email)}`, {
      method: "POST",
      body: JSON.stringify(reqData)
    });

    if(res.ok) {
      router.refresh();
      handleClose();
    } else {
      const errorData = await res.json();
      setStatusText(errorData.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col justify-center gap-6 pl-8 py-4">
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
            className="h-8 w-32 border border-[#333]/20 px-2 cursor-not-allowed"
            type="date"
            defaultValue={data.date}
            disabled
          />
        </div>
      </div>
      <div className="w-full h-15 flex items-center justify-center">
        <button
          className="w-25 h-10 rounded-full border border-[#6E2594]"
          onClick={() => updateData()}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Submit"}
        </button>
      </div>

      {statusText.length > 0 && <p className="font-mono text-red-500">{statusText}</p>}
    </div>
  )
}

function SelectDateScreen({ submitDate }: { submitDate: (arg: string) => void }) {
  const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleClick = async () => {
    setLoading(true);
    await submitDate(date);
    setLoading(false);
    setStatusText("Couldn't find data for that date");
  };

  return (
    <div className="w-full flex flex-col gap-4 pt-4 p-2">
      <div className="w-full flex flex-row items-center justify-center gap-2">
        <p className="font-mono">Select Date:</p>
        <input
          className="h-6 w-36 border border-[#333]/20 px-2"
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className="w-full h-15 flex items-center justify-center">
        <button
          className="w-25 h-10 rounded-full border border-color1"
          onClick={handleClick}
        >
          {loading ? <Spinner /> : "Submit"}
        </button>
      </div>

      {statusText.length > 0 && <p className="w-full text-center font-mono text-red-500">{statusText}</p>}
    </div>
  )
}

function EditIcon({ size=12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function CloseIcon({ size=12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
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

