import { authHandlers } from "@/features/admin/auth-handlers";

export const POST = authHandlers.signIn;
export const DELETE = authHandlers.signOut;
