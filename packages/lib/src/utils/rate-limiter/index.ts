type RateLimitInfo = { count: number; lastRequest: number };
const RATE_LIMIT = 10; // Max requests per minute
const rateLimits = new Map<string, RateLimitInfo>();

export const checkRateLimit = (sessionId: string): boolean => {
  const currentTime = Date.now();
  const sessionRate = rateLimits.get(sessionId) || { count: 0, lastRequest: 0 };

  if (currentTime - sessionRate.lastRequest > 60 * 1000) {
    sessionRate.count = 0;
  }

  sessionRate.count += 1;
  sessionRate.lastRequest = currentTime;

  rateLimits.set(sessionId, sessionRate);

  return sessionRate.count > RATE_LIMIT;
};
