'use client'

import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'
import { Package, Clock, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  confirmed: <CheckCircle className="w-5 h-5" />,
  preparing: <Package className="w-5 h-5" />,
  'picked-up': <Truck className="w-5 h-5" />,
  'in-transit': <Truck className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
  cancelled: <Clock className="w-5 h-5" />,
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const { getOrdersByUser } = useOrderStore()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accedi per vedere i tuoi ordini</h1>
        <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
          Vai al login
        </Link>
      </div>
    )
  }

  const orders = getOrdersByUser(user.id)

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-24 h-24 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nessun ordine</h2>
        <p className="text-gray-500 mb-8">Non hai ancora effettuato ordini</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
        >
          Inizia lo Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">I Miei Ordini</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">#{order.id}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {statusIcons[order.status]}
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} articoli</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.product.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-lg text-sm"
                    >
                      <span>{item.product.image}</span>
                      <span className="text-gray-600">{item.product.name}</span>
                      <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {order.assignedAgentId && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-xl flex items-center gap-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Agente assegnato</p>
                    <p className="text-xs text-gray-500">In arrivo verso la tua posizione</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
