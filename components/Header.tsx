'use client';

import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full h-20 flex flex-row items-center bg-header px-4">
      <div className="">
        <p className="font-mono text-text text-lg font-bold">Dashboard</p>
      </div>

      <div className="flex-1">
      </div>

      <div className="flex flex-row items-center gap-2">
        <p className="font-mono text-[#777] text-sm">{session?.user?.email}</p>
        <SignOutButton size={24} />
      </div>
    </header>
  );
}
