import type React from "react";

import type { ChatMessage } from "@shared/lib/types";

import { Typography } from "../../../ui/Typography/Typography";
import { formatTimestamp } from "./utils";

export const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-lg shadow-md ${
          message.role === "user"
            ? "bg-main-primary text-white"
            : "bg-backgroundColor-messageBox text-main-dark"
        } ${message.role === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          wordBreak: "break-word",
        }}
      >
        {message.title && (
          <Typography
            className={`font-semibold mb-1 ${message.role === "user" ? "text-white" : "text-gray-800"}`}
            variant="caption"
          >
            {message.title}
          </Typography>
        )}
        <Typography className="whitespace-pre-wrap leading-relaxed" variant="body1">
          {message.content}
        </Typography>

        <Typography className="text-gray-500 mt-1" variant="body2">
          {message.timestamp ? formatTimestamp(message.timestamp) : ""}
        </Typography>
      </div>
    </div>
  );
};
