import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { generateUsername } from "unique-username-generator";
import { NextAuthOptions, getServerSession } from "next-auth";

import { db } from "./db";
import { env } from "./env.mjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ token, session }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },

    jwt: async ({ token, user }) => {
      const databaseUser = await db.user.findUnique({
        where: {
          email: token.email ?? undefined,
        },
      });

      if (databaseUser === null) {
        token.id = user.id;
        return token;
      }

      if (databaseUser.username === null) {
        await db.user.update({
          where: {
            id: databaseUser.id,
          },
          data: {
            username: generateUsername(),
          },
        });
      }

      return {
        id: databaseUser.id,
        name: databaseUser.name,
        email: databaseUser.email,
        picture: databaseUser.image,
        username: databaseUser.username,
      };
    },

    redirect: () => {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
