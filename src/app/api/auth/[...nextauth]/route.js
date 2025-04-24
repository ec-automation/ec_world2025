import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth-options"; // o relativa

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // ✅ obligatorio
