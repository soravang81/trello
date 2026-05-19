import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from "next-auth"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

type AuthUser = {
    _id: string;
    name: string;
    email: string;
};

export const authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: '' },
                password: { label: 'Password', type: 'password' },
                username : { label: 'username', type: 'text' },
                action: { label: 'action', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                if (!backendUrl) {
                    console.error("NEXT_PUBLIC_BACKEND_URL is not configured.");
                    return null;
                }

                try {
                    if (credentials.action === "signin") {
                        const { email, password } = credentials;
                        const { data } = await axios.post<AuthUser>(`${backendUrl}/user/login`, {
                            email,
                            password,
                        });

                        return {
                            id: data._id,
                            name: data.name,
                            email: data.email,
                        };
                    }

                    if (credentials.action === "signup") {
                        const { email, password , username  } = credentials;
                        const { data } = await axios.post<AuthUser>(`${backendUrl}/user/signup`, {
                            email,
                            password,
                            username,
                        });

                        return {
                            id: data._id,
                            name: data.name,
                            email: data.email,
                        };
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error("Authentication request failed:", error.response?.data ?? error.message);
                    } else {
                        console.error("Authentication request failed:", error);
                    }
                }

                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }

            return session;
        },
    },
    pages :{
        signIn : "/login",
    }
}
