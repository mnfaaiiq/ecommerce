/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { SignIn, User } from "@/lib/firebase/service";

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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Fetch user details
        const user = (await SignIn(email)) as User;

        if (user && typeof user.password === "string") {
          // Ensure user.password is a string
          const passwordConfirm = await compare(password, user.password);
          if (passwordConfirm) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.email = token.email;
      session.user.fullname = token.fullname;
      session.user.phone = token.phone;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
