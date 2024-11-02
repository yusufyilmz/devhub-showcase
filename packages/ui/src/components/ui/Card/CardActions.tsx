interface CardAction {
  label: string
  onClick: () => void
}

interface CardActionsProps {
  actions: CardAction[]
}

export function CardActions({ actions }: CardActionsProps) {
  return (
    <div className="px-4 py-2 border-t border-gray-200 flex justify-end space-x-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="px-4 py-1 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
