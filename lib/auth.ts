import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  session: { strategy: "jwt" }
});
