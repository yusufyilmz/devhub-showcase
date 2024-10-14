'use client'

import { Box, Typography } from '@mui/material'
import { ChatMessage } from '@shared/lib/types'
import { formatTimestamp } from './utils'

export const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({
  message
}) => {
  return (
    <Box
      className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <Box
        className={`max-w-xs p-3 rounded-lg shadow-md ${
          message.role === 'user'
            ? 'bg-main-black text-white'
            : 'bg-backgroundColor-messageBox text-main-black'
        } ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
        style={{
          wordBreak: 'break-word',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {message.title && (
          <Typography
            variant="subtitle2"
            className="font-semibold mb-1"
            style={{ color: message.role === 'user' ? '#FFF' : '#333' }}
          >
            {message.title}
          </Typography>
        )}
        <Typography
          variant="body2"
          className="whitespace-pre-wrap"
          style={{ lineHeight: '1.5' }}
        >
          {message.content}
        </Typography>

        <Typography variant="caption" className="text-gray-500 mt-1">
          {message.timestamp ? formatTimestamp(message.timestamp) : ''}
        </Typography>
      </Box>
    </Box>
  )
}
