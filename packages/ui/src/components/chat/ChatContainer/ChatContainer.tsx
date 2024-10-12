import { ChatMessage } from '@shared/lib'
import { ChatInput } from '../ChatInput/ChatInput'
import { ChatMessageBox } from '../ChatMessageBox'

type ChatContainerProps = {
  handleSendMessage: (input: string) => void
  messages: ChatMessage[]
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  handleSendMessage,
  messages
}) => {
  return (
    <div className="m-auto">
      <div className="flex overflow-hidden bg-white">
        <div className="relative flex flex-col md:h-[calc(100vh_-_6rem)] h-[calc(100vh_-_3rem)] w-full">
          <div className="flex-grow mb:0 md:mb-4 flex flex-col-reverse overflow-y-auto h-100 mobile:mt-12 tablet:mt-0 max-w-full mobile:w-full pb-[64px] mx-auto">
            <div className="p-4 md:p-8 md:pb-0">
              <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-main-black">
                    Chat with YusufBot
                  </h2>
                  <ChatMessageBox messages={messages} />
                  <ChatInput handleSendMessage={handleSendMessage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
