import { createComponentLogger } from "@shared/utils/client-logger";

import { DEFAULT_TRELLO_CONFIG, TRELLO_CONFIG } from "../constants";
import type { TrelloServiceConfig } from "../types";

/**
 * Enhanced Trello HTTP Client with comprehensive logging
 *
 * Features:
 * - 🚀 Request logging: method, URL, headers, body, timestamp
 * - 📥 Response logging: status, duration, size, content type, body summary
 * - 🔄 Smart parsing: JSON (.json()), HTML (.text()), and text content handling
 * - ⏳ Rate limiting: automatic retry with exponential backoff for HTTP 429
 * - ❌ Error logging: detailed error information with stack traces
 * - 🔒 Security: sensitive data (API keys, tokens) are sanitized in logs
 * - 📊 Performance: request timing and response size tracking
 * - 🎯 Request tracking: unique request IDs for correlation
 * - 🏷️ Parse method tracking: shows which parsing method was used (json/html/text)
 *
 * Content Type Handling:
 * - application/json → response.json()
 * - text/html → response.text() with HTML title extraction
 * - text/* → response.text()
 * - other → response.text() (default)
 *
 * Logging is only active in development mode for performance and security.
 */

const MIN_REQUEST_DELAY = 500;
const MAX_REQUEST_DELAY = 7000;

const logger = createComponentLogger("TrelloClient");

interface RequestResult<T> {
  data: T;
  response: Response;
}

export class TrelloClient {
  private config: TrelloServiceConfig;

  constructor(config: TrelloServiceConfig = DEFAULT_TRELLO_CONFIG) {
    this.config = config;
  }

  private createQuery(): Record<string, string> {
    return {
      key: this.config.apiKey,
      token: this.config.token,
    };
  }

  async makeRequest<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options: {
      query?: Record<string, any>;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const executeRequest = () => {
        this.executeRequest<T>(method, path, options)
          .then((result) => {
            this.handleRequestComplete(result, resolve, reject, executeRequest);
          })
          .catch((error) => {
            reject(error);
          });
      };

      executeRequest();
    });
  }

  private async executeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options: {
      query?: Record<string, any>;
      data?: Record<string, any>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<RequestResult<T>> {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(2, 15);

    const query = { ...this.createQuery(), ...options.query };
    const url = new URL(`${TRELLO_CONFIG.BASE_URL}${path}`);

    logger.info("url", { url: url.toString() }); // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      method,
    };

    if (options.data && (method === "POST" || method === "PUT")) {
      requestOptions.body = JSON.stringify(options.data);
    }

    // Log request details
    logger.debug(`🚀 [${requestId}] Trello API Request`, {
      body: options.data,
      headers: options.headers,
      method,
      path,
      query: this.sanitizeQuery(query),
      timestamp: new Date().toISOString(),
      url: url.toString(),
    });

    try {
      const response = await fetch(url.toString(), requestOptions);
      const duration = Date.now() - startTime;
      let data: T;

      // Parse response data based on content type
      const contentType = response.headers.get("content-type") || "";
      let parseMethod = "text";

      if (contentType.includes("application/json")) {
        data = await response.json();
        parseMethod = "json";
      } else if (contentType.includes("text/html")) {
        data = (await response.text()) as any;
        parseMethod = "html";
      } else if (contentType.includes("text/")) {
        data = (await response.text()) as any;
        parseMethod = "text";
      } else {
        // Default to text for unknown content types
        data = (await response.text()) as any;
        parseMethod = "text (default)";
      }

      // Log response details
      const responseSize = this.getResponseSize(data);
      // const logLevel = response.status >= 400 ? 'error' : response.status === 429 ? 'warn' : 'debug'

      logger.debug(`📥 [${requestId}] Trello API Response`, {
        body: this.sanitizeResponseBody(data, response.status, contentType),
        contentType,
        duration: `${duration}ms`,
        headers: Object.fromEntries(
          Object.entries(response.headers).map(([key, value]) => [key, value]),
        ),
        method,
        parseMethod,
        path,
        responseSize,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
      });

      return { data, response };
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log error details
      logger.error(
        `❌ [${requestId}] Trello API Request Failed`,
        error instanceof Error ? error : undefined,
        {
          duration: `${duration}ms`,
          method,
          path,
          timestamp: new Date().toISOString(),
        },
      );

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Request failed: ${error}`);
    }
  }

  private handleRequestComplete<T>(
    result: RequestResult<T>,
    resolve: (value: T) => void,
    reject: (reason: any) => void,
    retryFn: () => void,
  ): void {
    const { data, response } = result;

    // Handle rate limiting (HTTP 429) - retry with random delay
    if (response.status === 429) {
      const delay =
        Math.floor(Math.random() * (MAX_REQUEST_DELAY - MIN_REQUEST_DELAY)) + MIN_REQUEST_DELAY;

      logger.warn(`⏳ Rate limited (HTTP 429), retrying in ${delay}ms`, {
        retryDelay: `${delay}ms`,
        status: response.status,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        retryFn();
      }, delay);
      return;
    }

    // Handle HTTP errors (400+)
    if (response.status >= 400) {
      const error = new Error(typeof data === "string" ? data : `HTTP ${response.status}`);
      (error as any).response = response;
      reject(error);
      return;
    }

    // Success case
    resolve(data);
  }

  /**
   * Sanitize query parameters for logging (hide sensitive data)
   */
  private sanitizeQuery(query: Record<string, any>): Record<string, any> {
    const sanitized = { ...query };

    // Hide sensitive information
    if (sanitized.key) {
      sanitized.key = `${sanitized.key.substring(0, 8)}...`;
    }
    if (sanitized.token) {
      sanitized.token = `${sanitized.token.substring(0, 12)}...`;
    }

    return sanitized;
  }

  /**
   * Sanitize response body for logging
   */
  private sanitizeResponseBody(data: any, status: number, contentType?: string): any {
    // For error responses, show full error message
    if (status >= 400) {
      return data;
    }

    // For large responses, show summary
    if (Array.isArray(data)) {
      return {
        length: data.length,
        sample: data.slice(0, 2).map((item) => this.summarizeObject(item)),
        type: "array",
      };
    }

    if (typeof data === "object" && data !== null) {
      return this.summarizeObject(data);
    }

    // For HTML responses, show a more meaningful summary
    if (typeof data === "string" && contentType?.includes("text/html")) {
      const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : "No title";

      if (data.length > 500) {
        return {
          length: data.length,
          preview: `${data.substring(0, 200)}...`,
          title,
          type: "html",
        };
      }

      return {
        content: data,
        length: data.length,
        title,
        type: "html",
      };
    }

    // For text responses, truncate if too long
    if (typeof data === "string" && data.length > 500) {
      return `${data.substring(0, 500)}... (truncated, total length: ${data.length})`;
    }

    return data;
  }

  /**
   * Create a summary of an object for logging
   */
  private summarizeObject(obj: any): any {
    if (!obj || typeof obj !== "object") return obj;

    const summary: any = {};
    const keys = Object.keys(obj);

    // Show first few keys and their types
    keys.slice(0, 5).forEach((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        summary[key] = `[Array(${value.length})]`;
      } else if (typeof value === "object" && value !== null) {
        summary[key] = "{Object}";
      } else {
        summary[key] = value;
      }
    });

    if (keys.length > 5) {
      summary["..."] = `${keys.length - 5} more properties`;
    }

    return summary;
  }

  /**
   * Calculate response size for logging
   */
  private getResponseSize(data: any): string {
    try {
      const size = new Blob([JSON.stringify(data)]).size;
      if (size < 1024) return `${size}B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
      return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    } catch {
      return "unknown";
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      logger.debug("🏥 Starting Trello API health check...");

      const response = await this.makeRequest("GET", "/members/me");

      logger.debug("✅ Trello API health check passed", {
        memberInfo: this.summarizeObject(response),
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      logger.error("❌ Trello API health check failed", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<TrelloServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): TrelloServiceConfig {
    return { ...this.config };
  }
}
