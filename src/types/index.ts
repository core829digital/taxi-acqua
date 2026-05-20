export type UserRole = 'customer' | 'agent' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  address?: Address
  createdAt: string
}

export interface Address {
  street: string
  city: string
  zip: string
  lat: number
  lng: number
}

export type ProductCategory = 'acqua' | 'bibite' | 'soft-drinks' | 'energy' | 'premium'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image: string
  volume?: string
  inStock: boolean
  rating: number
  reviews: number
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'picked-up' | 'in-transit' | 'delivered' | 'cancelled'

export type PaymentMethod = 'cash' | 'card' | 'wallet'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  deliveryAddress: Address
  deliveryNotes?: string
  assignedAgentId?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: UserRole
  content: string
  timestamp: string
  orderId?: string
  read: boolean
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  orderId?: string
}

export interface AgentTelemetry {
  agentId: string
  agentName: string
  lat: number
  lng: number
  speed: number
  heading: number
  battery: number
  status: 'available' | 'busy' | 'offline' | 'break'
  currentOrderId?: string
  deliveriesToday: number
  rating: number
  lastUpdate: string
}

export interface Notification {
  id: string
  userId: string
  type: 'order' | 'chat' | 'delivery' | 'system'
  title: string
  message: string
  read: boolean
  timestamp: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeDeliveries: number
  completedToday: number
  avgDeliveryTime: string
  customerSatisfaction: number
}
