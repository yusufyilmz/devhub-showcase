export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center mb-3 px-2">
      <div className="flex space-x-1">
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  )
}
