import { create } from 'zustand'
import { ChatMessage, ChatConversation } from '@/types'
import { generateId } from '@/lib/utils'

interface ChatState {
  conversations: ChatConversation[]
  messages: Record<string, ChatMessage[]>
  activeConversation: string | null
  setActiveConversation: (conversationId: string) => void
  sendMessage: (conversationId: string, senderId: string, senderName: string, senderRole: any, content: string, orderId?: string) => void
  markAsRead: (conversationId: string) => void
  getOrCreateConversation: (participants: string[], orderId?: string) => string
}

const initialMessages: Record<string, ChatMessage[]> = {
  c1: [
    {
      id: 'm1',
      senderId: 'a1',
      senderName: 'Luca Verdi',
      senderRole: 'agent',
      content: 'Buongiorno! Sono in zona per la tua consegna. Arrivo tra 5 minuti.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: true,
    },
    {
      id: 'm2',
      senderId: 'u1',
      senderName: 'Marco Rossi',
      senderRole: 'customer',
      content: 'Perfetto, ti aspetto! Grazie mille.',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      orderId: 'o1',
      read: true,
    },
  ],
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [
    {
      id: 'c1',
      participants: ['u1', 'a1'],
      lastMessage: initialMessages.c1[1],
      unreadCount: 0,
      orderId: 'o1',
    },
  ],
  messages: initialMessages,
  activeConversation: null,

  setActiveConversation: (conversationId: string) => {
    set({ activeConversation: conversationId })
    get().markAsRead(conversationId)
  },

  sendMessage: (conversationId, senderId, senderName, senderRole, content, orderId) => {
    const message: ChatMessage = {
      id: generateId(),
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date().toISOString(),
      orderId,
      read: false,
    }

    set((state) => {
      const convMessages = state.messages[conversationId] || []
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...convMessages, message],
        },
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: message }
            : c
        ),
      }
    })
  },

  markAsRead: (conversationId: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }))
  },

  getOrCreateConversation: (participants: string[], orderId?: string) => {
    const existing = get().conversations.find(
      (c) =>
        c.participants.length === participants.length &&
        c.participants.every((p) => participants.includes(p))
    )
    if (existing) return existing.id

    const newId = generateId()
    const newConv: ChatConversation = {
      id: newId,
      participants,
      unreadCount: 0,
      orderId,
    }

    set((state) => ({
      conversations: [...state.conversations, newConv],
      messages: { ...state.messages, [newId]: [] },
    }))

    return newId
  },
}))
