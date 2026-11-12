import { createAppEnv } from "@shared/env";

export const env = createAppEnv({ requireHostedRedis: true });
