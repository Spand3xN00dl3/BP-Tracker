// import GoogleSignInButton from "@/components/SignInButton";
import SignInButton from "@/components/SignInButton";

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-80 rounded-md border border-card-border flex flex-col gap-4 py-4">
        <div className="w-full h-15 flex items-center justify-center">
          <p className="font-mono text-2xl">Login</p>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          {/* <GoogleSignInButton /> */}
          <SignInButton provider="google" />
          <SignInButton provider="github" />
        </div>
      </div>
    </div>
  )
}