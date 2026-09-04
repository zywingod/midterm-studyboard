import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // TODO (Step 1): Implement the authorize function.
      // This runs every time someone tries to log in with email/password.
      //
      // 1. If credentials.email or credentials.password is missing, return null.
      // 2. Look up the user by email: prisma.user.findUnique({ where: { email } }).
      //    If no user is found, return null (don't reveal whether the email exists —
      //    just fail the same way as a wrong password).
      // 3. Compare the submitted password against the stored hash:
      //    await bcrypt.compare(credentials.password, user.password)
      //    If it doesn't match, return null.
      // 4. If everything checks out, return { id: user.id, name: user.name, email: user.email }.
      //    NEVER return the password hash.
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password, 
          user.password
        )

        if (!isValidPassword) {
          return null;
        }

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        };
      },
    }),
  ],
  callbacks: {
    // TODO (Step 2): Copy the user's id onto the JWT token.
    // This callback runs whenever a JWT is created/updated. The `user`
    // argument is only present right after authorize() succeeds — that's
    // your one chance to pull the id out and store it on the token for
    // future requests.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Copy the user's id onto the token
      }
      return token; // TODO: if `user` exists, copy user.id onto token.id
    },
    // TODO (Step 3): Copy the id back out of the token onto the session.
    // This callback runs whenever the session is checked (useSession(),
    // getServerSession()). Without this, session.user will never have an
    // `id` field, even though the token does.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Copy the token's id onto the session user
      }
      return session; // TODO: if session.user exists, copy token.id onto session.user.id
    },
  },
};
