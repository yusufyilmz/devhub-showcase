import { authHandlers } from "@/services/admin/get-auth-handlers";

export const POST = authHandlers.signIn;
export const DELETE = authHandlers.signOut;
