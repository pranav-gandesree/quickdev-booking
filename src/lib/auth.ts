
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../prisma/prisma"
import type { Adapter } from "next-auth/adapters";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  pages: {
    signIn: "/",
  },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {

    async signIn({ user, profile }: any) {

      try {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email!,
            name: user.name!,
            image: user.image!,
          },
        });
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false; 
      }

      return true; // Allow sign-in
    },

   async jwt({ user, token }: any) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

      async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
