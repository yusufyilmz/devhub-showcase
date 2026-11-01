"use client";

import { createContext, useContext } from "react";

export type StudioRequest = (input: string, init?: RequestInit) => Promise<Response>;

export const defaultStudioRequest: StudioRequest = (input, init) => fetch(input, init);

export const StudioRequestContext = createContext<StudioRequest | null>(null);

export function useStudioRequest(): StudioRequest {
  const request = useContext(StudioRequestContext);
  return request ?? defaultStudioRequest;
}
