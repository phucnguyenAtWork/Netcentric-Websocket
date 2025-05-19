import React, { useState, useRef, useContext, useEffect } from 'react'
import ChatBody from '../../components/chat_body'
import { WebsocketContext } from '../../modules/websocket_provider'
import { useRouter } from 'next/router'
import { API_URL } from '../../constants'
import autosize from 'autosize'
import { AuthContext } from '../../modules/auth_provider'

export type Message = {
  content: string
  client_id: string
  username: string
  room_id: string
  type: 'recv' | 'self'
}

const index = () => {
  const [messages, setMessages] = useState<Array<Message>>([])
  const textarea = useRef<HTMLTextAreaElement>(null)
  const { conn } = useContext(WebsocketContext)
  const [users, setUsers] = useState<Array<{ username: string }>>([])
  const { user } = useContext(AuthContext)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conn === null) {
      router.push('/')
      return
    }

    const roomId = conn.url.split('/')[5]
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        setUsers(data)
      } catch (e) {
        console.error(e)
      }
    }
    getUsers()
  }, [conn, router])

  useEffect(() => {
    if (textarea.current) {
      autosize(textarea.current)
    }

    if (conn === null) {
      router.push('/')
      return
    }

    const messageHandler = (message: MessageEvent) => {
      const m = JSON.parse(message.data)
      console.log('Received message:', m) // Debug log

      if (m.content === 'A new user has joined the room') {
        setUsers(prevUsers => [...prevUsers, { username: m.username }])
        return
      }

      if (m.content === 'A user left the chat') {
        setUsers(prevUsers => prevUsers.filter(u => u.username !== m.username))
        return
      }

      // Xử lý tin nhắn chat dựa trên senderId
      const newMessage: Message = {
        content: m.content,
        client_id: m.senderId || '',
        username: m.username,
        room_id: m.roomId || '',
        type: m.senderId === user.id ? 'self' : 'recv'
      }
      
      setMessages(prevMessages => [...prevMessages, newMessage])
    }

    conn.onmessage = messageHandler

    return () => {
      if (conn) {
        conn.onmessage = null
      }
    }
  }, [conn, router, user?.id])

  const sendMessage = () => {
    if (!textarea.current?.value.trim() || !conn) return
    
    try {
      conn.send(textarea.current.value)
      textarea.current.value = ''
      textarea.current.style.height = 'auto'
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className='flex flex-col w-full h-screen bg-white'>
      <div className='flex-1 overflow-y-auto p-2 md:p-4 md:mx-6 mb-14'>
        <ChatBody data={messages} />
        <div ref={messagesEndRef} />
      </div>
      <div className='fixed bottom-0 left-0 right-0 p-2 md:p-4 bg-white border-t border-grey'>
        <div className='flex flex-col md:flex-row px-2 md:px-4 py-2 md:mx-4 rounded-md gap-2 md:gap-0'>
          <div className='flex w-full md:mr-4 rounded-md border border-blue'>
            <textarea
              ref={textarea}
              placeholder='Type your message here'
              className='w-full p-2 rounded-md focus:outline-none text-base md:text-lg'
              style={{ resize: 'none', minHeight: '40px', maxHeight: '120px' }}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className='flex items-center w-full md:w-auto'>
            <button
              className='w-full md:w-auto px-4 py-2 rounded-md bg-blue text-white hover:bg-opacity-90 text-base md:text-lg'
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
