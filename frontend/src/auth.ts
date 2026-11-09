import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const INTERNAL_BACKEND_URL = process.env.INTERNAL_API_URL || BACKEND_URL;

function parseJwtExp(tokenString: string): number | null {
  try {
    const parts = tokenString.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(base64, "base64").toString("utf-8")
        : atob(base64);
    const parsed = JSON.parse(json);
    return typeof parsed.exp === "number" ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${INTERNAL_BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.access_token) {
            return {
              id: data.id,
              email: data.email,
              tier: data.tier,
              preferences: data.preferences,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Sync Google user with backend
          const res = await fetch(`${INTERNAL_BACKEND_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
            }),
          });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Backend Google auth failed:", res.status, errorData);
            return false;
          }
          
          const data = await res.json();
          // Store backend data in the user object for the JWT callback
          (user as any).id = data.id;
          (user as any).tier = data.tier;
          (user as any).preferences = data.preferences;
          (user as any).accessToken = data.access_token;
          return true;
        } catch (error) {
          console.error("Google sync error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id || user.id;
        token.tier = (user as any).tier;
        token.preferences = (user as any).preferences;
        token.accessToken = (user as any).accessToken;
        if ((user as any).accessToken) {
          token.accessTokenExpires = parseJwtExp((user as any).accessToken);
        }
      }

      // Check if backend JWT token has expired
      if (token.accessTokenExpires && Date.now() >= (token.accessTokenExpires as number)) {
        return {
          ...token,
          error: "AccessTokenExpired",
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).tier = token.tier;
        (session.user as any).preferences = token.preferences;
        (session.user as any).accessToken = token.accessToken;
        if (token.error) {
          (session as any).error = token.error;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
