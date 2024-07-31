import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession{
        user: {
            id: number;
            name : string;
            email : string
        };
    }

    interface User extends DefaultUser {
        data : {
            _id: number
            name : string;
            email : string
            action: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: number
        name : string;
        email : string
    }
}
