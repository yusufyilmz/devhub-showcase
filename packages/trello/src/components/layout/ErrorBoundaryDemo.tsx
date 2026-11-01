"use client";

import { useState } from "react";

import { Button, Typography } from "@shared/ui/components";

import { TrelloErrorBoundary } from "./TrelloErrorBoundary";

// Component that throws an error when button is clicked
const ErrorThrowingComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("This is a test error from the Trello component!");
  }

  return (
    <div className="border border-gray-300 rounded-md p-2">
      <Typography className="mb-2" variant="h6">
        Test Component
      </Typography>
      <Typography className="mb-2" variant="body2">
        This component will throw an error when you click the button below. The error will be caught
        by the TrelloErrorBoundary: an error toast, an inline recovery panel, and a full details
        dialog.
      </Typography>
      <Button color="error" onClick={() => setShouldThrow(true)} variant="destructive">
        Throw Error
      </Button>
    </div>
  );
};

// Demo component showing the error boundary in action
export const ErrorBoundaryDemo = () => {
  const [key, setKey] = useState(0);

  const resetComponent = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="p-3">
      <Typography className="text-2xl font-bold" variant="h5">
        TrelloErrorBoundary Demo
      </Typography>

      <Typography className="mb-3 text-sm" variant="body1">
        This demo shows how the TrelloErrorBoundary works:
      </Typography>

      <div className="mb-2">
        <Button onClick={resetComponent} variant="outline">
          Reset Component
        </Button>
      </div>

      <TrelloErrorBoundary>
        <ErrorThrowingComponent key={key} />
      </TrelloErrorBoundary>

      <div className="bg-info-light rounded-md mt-3 p-2">
        <Typography className="mb-2" variant="subtitle2">
          Expected Behavior:
        </Typography>
        <Typography className="pl-2" variant="body2">
          <li>Click "Throw Error" to trigger an error</li>
          <li>A red notification alert will appear in the top-right corner</li>
          <li>The alert will show "Trello Error: [error message]"</li>
          <li>A "Show Details" button will be visible in the alert</li>
          <li>Click "Show Details" to open a dialog with full error information</li>
          <li>The dialog includes stack trace and component stack in expandable sections</li>
          <li>Use "Reset Component" to restore the component to working state</li>
        </Typography>
      </div>
    </div>
  );
};

export default ErrorBoundaryDemo;
