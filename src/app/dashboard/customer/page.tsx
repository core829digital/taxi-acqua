'use client'

import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { useChatStore } from '@/stores/chatStore'
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  MessageSquare,
  Star,
  MapPin,
  Settings,
  User,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CustomerDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { getOrdersByUser } = useOrderStore()
  const { conversations } = useChatStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!user) return null

  const orders = getOrdersByUser(user.id)
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const myConversations = conversations.filter((c) => c.participants.includes(user.id))

  const stats = [
    {
      label: 'Ordini Totali',
      value: orders.length.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'In Corso',
      value: activeOrders.length.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      label: 'Totale Speso',
      value: formatPrice(totalSpent),
      icon: <Star className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Messaggi',
      value: myConversations.length.toString(),
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Benvenuto, {user.name}!
        </h1>
        <p className="text-gray-500 mt-1">Gestisci i tuoi ordini e le tue consegne</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link
          href="/shop"
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl text-white hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8" />
          <div>
            <p className="font-semibold">Nuovo Ordine</p>
            <p className="text-sm text-blue-100">Sfoglia i prodotti</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto" />
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow"
        >
          <MessageSquare className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-semibold text-gray-900">Chat</p>
            <p className="text-sm text-gray-500">Contatta un agente</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>
        <Link
          href="/orders"
          className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow"
        >
          <Truck className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="font-semibold text-gray-900">Traccia Ordine</p>
            <p className="text-sm text-gray-500">Stato consegne</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Ordini Recenti</h2>
        </div>
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      {order.items[0]?.product.image || '📦'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">#{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Nessun ordine ancora. Inizia lo shopping!
          </div>
        )}
      </div>
    </div>
  )
}
