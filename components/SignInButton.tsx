'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import GoogleIcon from "./icons/GoogleIcon";
import GithubIcon from "./icons/GithubIcon";

export default function SignInButton({ provider }: { provider: "google" | "github" }) {
  const [loading, setLoading] = useState(false);

  const iconMap = {
    "google": <GoogleIcon size={28} />,
    "github": <GithubIcon size={28} />,
  };

  const handleClick = async () => {
    setLoading(true);
    await signIn(provider);
    setLoading(false);
  };

  return (
    <button
      className="w-66 h-10 rounded-sm border border-color1 flex flex-row items-center justify-center gap-4"
      onClick={handleClick}
    >
      {loading ?
        <Spinner /> :
        <>
          {/* <GoogleIcon size={36} /> */}
          {iconMap[provider]}
          <p className="font-mono">{`Sign in with ${provider.slice(0, 1).toUpperCase() + provider.slice(1)}`}</p>
        </>
      }
    </button>
  );
}