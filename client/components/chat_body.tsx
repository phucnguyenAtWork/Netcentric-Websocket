import React from 'react'
import { Message } from '../pages/app'

const ChatBody = ({ data }: { data: Array<Message> }) => {
  return (
    <div className='space-y-3'>
      {data.map((message: Message, index: number) => {
        if (message.type === 'self') {
          return (
            <div
              className='flex flex-col w-full text-right justify-end'
              key={index}
            >
              <div className='text-xs md:text-sm text-gray-600'>{message.username}</div>
              <div className='flex justify-end'>
                <div className='bg-blue text-white px-3 py-2 md:px-4 md:py-2 rounded-lg max-w-[85%] md:max-w-[70%] break-words text-sm md:text-base'>
                  {message.content}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className='flex flex-col' key={index}>
              <div className='text-xs md:text-sm text-gray-600'>{message.username}</div>
              <div className='flex justify-start'>
                <div className='bg-grey text-dark-secondary px-3 py-2 md:px-4 md:py-2 rounded-lg max-w-[85%] md:max-w-[70%] break-words text-sm md:text-base'>
                  {message.content}
                </div>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default ChatBody
