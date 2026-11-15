import axios from "axios";

import { env } from "@shared/env";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
