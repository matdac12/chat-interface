import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    lastName?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      lastName?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    lastName?: string | null;
  }
}
