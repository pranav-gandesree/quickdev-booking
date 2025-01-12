
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "../../prisma/prisma"
// import type { Adapter } from "next-auth/adapters";
// import { SessionStrategy } from "next-auth";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma) as Adapter,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//       allowDangerousEmailAccountLinking: true,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET || "secr3t",
//   pages: {
//     signIn: "/",
//   },
//   session: { strategy: "jwt" as SessionStrategy },
//   callbacks: {

//     async signIn({ user, profile }: any) {

//       try {
//         await prisma.user.upsert({
//           where: { email: user.email! },
//           update: {
//             name: user.name,
//             image: user.image,
//           },
//           create: {
//             email: user.email!,
//             name: user.name!,
//             image: user.image!,
//           },
//         });
//       } catch (error) {
//         console.error("Error saving user to database:", error);
//         return false; 
//       }

//       return true; // Allow sign-in
//     },

//    async jwt({ user, token }: any) {
//       if (user) {
//         const dbUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//         });
//         if (dbUser) {
//           token.uid = dbUser.id;
//           token.role = dbUser.role;
//         }
//       }
//       return token;
//     },

//       async session({ session, token }: any) {
//       if (token) {
//         session.accessToken = token.accessToken;
//         session.user.id = token.sub;
//         session.user.email = token.email;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
// };
























import GoogleProvider from 'next-auth/providers/google'
import prisma from '../../prisma/prisma'
import { SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";


export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
    pages: {
    signIn: "/",
  },
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: 'USER', // Default role
              },
            })
          }
          return true
        } catch (error) {
          console.error('Error checking user:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }: any) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { developerProfile: true }
        })
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          // Consider user onboarded if they're a regular user
          // or if they're a developer with a complete profile
          session.user.hasOnboarded = user.role === 'USER' || 
            (user.role === 'DEVELOPER' && !!user.developerProfile)
        }
      }
      return session
    },
  },
}
