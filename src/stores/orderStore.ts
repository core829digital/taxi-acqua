import { create } from 'zustand'
import { Order, OrderStatus, CartItem, Address, PaymentMethod } from '@/types'
import { generateId } from '@/lib/utils'

interface OrderState {
  orders: Order[]
  createOrder: (
    items: CartItem[],
    total: number,
    paymentMethod: PaymentMethod,
    deliveryAddress: Address,
    deliveryNotes?: string
  ) => string
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  assignAgent: (orderId: string, agentId: string) => void
  getOrdersByUser: (userId: string) => Order[]
  getOrdersByAgent: (agentId: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],

  createOrder: (
    items: CartItem[],
    total: number,
    paymentMethod: PaymentMethod,
    deliveryAddress: Address,
    deliveryNotes?: string
  ) => {
    const orderId = generateId()
    const now = new Date().toISOString()
    const order: Order = {
      id: orderId,
      userId: 'u1',
      items,
      total,
      status: 'pending',
      paymentMethod,
      deliveryAddress,
      deliveryNotes,
      createdAt: now,
      updatedAt: now,
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
    }
    set((state) => ({ orders: [...state.orders, order] }))
    return orderId
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }))
  },

  assignAgent: (orderId: string, agentId: string) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, assignedAgentId: agentId, updatedAt: new Date().toISOString() }
          : o
      ),
    }))
  },

  getOrdersByUser: (userId: string) => {
    return get().orders.filter((o) => o.userId === userId)
  },

  getOrdersByAgent: (agentId: string) => {
    return get().orders.filter((o) => o.assignedAgentId === agentId)
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((o) => o.id === orderId)
  },
}))
