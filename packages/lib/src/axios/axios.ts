import axios from "axios";

import { emitHttpIn, emitHttpOut } from "@shared/utils";

const axiosServices = axios.create();

axiosServices.interceptors.request.use((config) => {
  try {
    const url = config.baseURL ? `${config.baseURL}${config.url || ""}` : config.url || "";
    const init: RequestInit = {
      body: typeof config.data === "string" ? (config.data as string) : undefined,
      headers: (config.headers as any) || undefined,
      method: (config.method || "GET").toUpperCase(),
    };
    emitHttpOut(url, init);
  } catch {
    // ignore
  }
  return config;
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => {
    try {
      const url = response.config.baseURL
        ? `${response.config.baseURL}${response.config.url || ""}`
        : response.config.url || "";
      const method = (response.config.method || "GET").toUpperCase();
      // Create a minimal Response-like object for debug
      const resLike = new Response(
        typeof response.data === "string" ? response.data : JSON.stringify(response.data),
        {
          headers: new Headers(response.headers as any),
          status: response.status,
        },
      );
      emitHttpIn(url, method, resLike);
    } catch {
      // ignore
    }
    return response;
  },
  (error) => {
    try {
      const cfg = error?.config || {};
      const url = cfg.baseURL ? `${cfg.baseURL}${cfg.url || ""}` : cfg.url || "";
      const method = (cfg.method || "GET").toUpperCase();
      const body =
        typeof error?.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error?.response?.data || { message: "Axios error" });
      const resLike = new Response(body, {
        headers: new Headers(error?.response?.headers || {}),
        status: error?.response?.status || 0,
      });
      emitHttpIn(url, method, resLike);
    } catch {
      // ignore
    }
    return Promise.reject(error?.response?.data || "Wrong Services");
  },
);

export default axiosServices;
