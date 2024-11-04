/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignIn } from "@/lib/firebase/service";
import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextApiRequest, NextApiResponse } from "next";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          console.log("Attempting to sign in user:", email);
          const user = await SignIn(email);
          console.log("User data received:", user);

          if (user && typeof user.password === "string") {
            const passwordConfirm = await compare(password, user.password);
            if (passwordConfirm) {
              console.log("Authentication successful for:", email);
              return user;
            } else {
              console.error("Password mismatch for user:", email);
              return null;
            }
          } else {
            console.error(
              "User not found or password missing in user object:",
              user
            );
            return null;
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.fullname) {
        session.user.fullname = token.fullname;
      }
      if (token.phone) {
        session.user.phone = token.phone;
      }
      if (token.role) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

// Create a handler that accepts both GET and POST methods
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure we handle both GET and POST requests
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  return await NextAuth(req, res, authOptions);
}

export default handler;
