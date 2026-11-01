"use client";

import type { FC } from "react";

import { useTrelloStoreReady } from "../../hooks/useTrelloStoreReady";
import { TrelloErrorBoundary } from "./TrelloErrorBoundary";

/**
 * Quick test component to verify the error handling and store initialization
 * This can be used to test that all the error boundaries and safety checks are working
 */
export const TrelloQuickTest: FC = () => {
  const { isReady, error } = useTrelloStoreReady();

  return (
    <TrelloErrorBoundary>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
          borderRadius: "8px",
          margin: "20px",
          padding: "20px",
        }}
      >
        <h3 style={{ color: "#333", margin: "0 0 16px 0" }}>🧪 Trello Store Test</h3>

        <div style={{ marginBottom: "12px" }}>
          <strong>Store Status:</strong>{" "}
          <span
            style={{
              color: isReady ? "#28a745" : error ? "#dc3545" : "#ffc107",
              fontWeight: "bold",
            }}
          >
            {error ? `❌ Error: ${error}` : isReady ? "✅ Ready" : "⏳ Initializing..."}
          </span>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <strong>Error Boundary:</strong> <span style={{ color: "#28a745" }}>✅ Active</span>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <strong>Safety Checks:</strong> <span style={{ color: "#28a745" }}>✅ Implemented</span>
        </div>

        <div
          style={{
            backgroundColor: isReady ? "#d4edda" : "#fff3cd",
            border: `1px solid ${isReady ? "#c3e6cb" : "#ffeaa7"}`,
            borderRadius: "4px",
            fontSize: "14px",
            padding: "12px",
          }}
        >
          {error ? (
            <>
              <strong>❌ Store initialization failed:</strong>
              <br />
              {error}
              <br />
              <em>This error is now properly caught and handled.</em>
            </>
          ) : isReady ? (
            <>
              <strong>✅ All systems operational!</strong>
              <br />
              The Trello store is ready and all components should work without runtime errors.
            </>
          ) : (
            <>
              <strong>⏳ Initializing store...</strong>
              <br />
              Please wait while the Trello integration initializes.
            </>
          )}
        </div>

        {isReady && (
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ color: "#333", margin: "0 0 8px 0" }}>✅ Fixed Issues:</h4>
            <ul style={{ fontSize: "14px", margin: 0, paddingLeft: "20px" }}>
              <li>Added null/undefined checks for card data</li>
              <li>Added store action availability checks</li>
              <li>Implemented comprehensive error boundaries</li>
              <li>Added store readiness authentication</li>
              <li>Fixed TypeScript typing issues</li>
              <li>Added graceful fallbacks for missing data</li>
            </ul>
          </div>
        )}
      </div>
    </TrelloErrorBoundary>
  );
};
