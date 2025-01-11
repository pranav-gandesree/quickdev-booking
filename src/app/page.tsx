
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "../../prisma/prisma";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/components/canvas/GoogleSignInButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      const isNewUser = user.createdAt === user.updatedAt;
      redirect(isNewUser ? "/onboarding" : "/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
    <GoogleSignInButton>Sign in</GoogleSignInButton>
    
    </div>
  );
}
