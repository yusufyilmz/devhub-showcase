import React from 'react'
import { Typography } from '../../../ui/Typography'
import { ChatMessage } from '@shared/lib/types'
import { formatTimestamp } from './utils'

export const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({
  message
}) => {
  return (
    <div
      className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg shadow-md ${
          message.role === 'user'
            ? 'bg-main-primary text-white'
            : 'bg-backgroundColor-messageBox text-main-dark'
        } ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
        style={{
          wordBreak: 'break-word',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {message.title && (
          <Typography
            variant="caption"
            className={`font-semibold mb-1 ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}
          >
            {message.title}
          </Typography>
        )}
        <Typography
          variant="body1"
          className="whitespace-pre-wrap leading-relaxed"
        >
          {message.content}
        </Typography>

        <Typography variant="body2" className="text-gray-500 mt-1">
          {message.timestamp ? formatTimestamp(message.timestamp) : ''}
        </Typography>
      </div>
    </div>
  )
}
