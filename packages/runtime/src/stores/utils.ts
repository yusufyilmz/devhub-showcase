import type { ComponentLogger } from "@shared/utils/client-logger";

const readInitialFlag = () => {
  let envValue: string | undefined;
  if (typeof process !== "undefined") {
    envValue = process.env.NEXT_PUBLIC_CHAT_V2_DEBUG ?? process.env.CHAT_V2_DEBUG;
  }

  if (typeof envValue === "string") {
    return envValue.toLowerCase() === "true";
  }

  if (typeof globalThis !== "undefined") {
    const globalFlag = (globalThis as { __CHAT_V2_DEBUG__?: boolean }).__CHAT_V2_DEBUG__;
    if (typeof globalFlag === "boolean") {
      return globalFlag;
    }
  }

  return false;
};

let debugEnabled = readInitialFlag();

export const isChatV2DebugEnabled = () => debugEnabled;

export const setChatV2DebugEnabled = (enabled: boolean) => {
  debugEnabled = enabled;
  if (typeof globalThis !== "undefined") {
    (globalThis as { __CHAT_V2_DEBUG__?: boolean }).__CHAT_V2_DEBUG__ = enabled;
  }
};

export const chatV2LogDebug = (
  logger: ComponentLogger,
  message: string,
  context?: Record<string, unknown>,
) => {
  if (!debugEnabled) return;
  if (context) {
    logger.debug(message, context);
  } else {
    logger.debug(message);
  }
};
