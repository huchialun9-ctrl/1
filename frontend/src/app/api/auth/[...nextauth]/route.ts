import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<string, string> | undefined) {
                if (!credentials) return null;
                // Placeholder for backend API call
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });
                const user = await res.json();

                if (res.ok && user) {
                    return user;
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
