'use client'

import { useState, useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { formatTime } from '@/lib/utils'
import { Send, MessageSquare, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const { user } = useAuthStore()
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
  } = useChatStore()

  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeConversation])

  const currentMessages = activeConversation ? messages[activeConversation] || [] : []
  const activeConv = conversations.find((c) => c.id === activeConversation)

  const handleSend = () => {
    if (!newMessage.trim() || !activeConversation || !user) return

    sendMessage(
      activeConversation,
      user.id,
      user.name,
      user.role,
      newMessage.trim(),
      activeConv?.orderId
    )
    setNewMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <MessageSquare className="w-24 h-24 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accedi per chattare</h1>
        <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
          Vai al login
        </Link>
      </div>
    )
  }

  const myConversations = conversations.filter((c) => c.participants.includes(user.id))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messaggi</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[calc(100vh-12rem)] flex">
        {/* Conversation List */}
        <div
          className={`${
            activeConversation ? 'hidden md:flex' : 'flex'
          } flex-col w-full md:w-80 border-r border-gray-100`}
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Conversazioni</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {myConversations.length > 0 ? (
              myConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${
                    activeConversation === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">
                        {conv.orderId ? `Ordine #${conv.orderId}` : 'Chat'}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-400">
                          {formatTime(conv.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.content || 'Nessun messaggio'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p>Nessuna conversazione</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            activeConversation ? 'flex' : 'hidden md:flex'
          } flex-col flex-1`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation('')}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {activeConv?.orderId ? `Ordine #${activeConv.orderId}` : 'Chat'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentMessages.length} messaggi
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => {
                  const isMine = msg.senderId === user.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isMine
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {!isMine && (
                          <p className="text-xs font-medium text-blue-500 mb-1">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMine ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Scrivi un messaggio..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="font-medium">Seleziona una conversazione</p>
                <p className="text-sm">oppure iniziane una nuova</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
