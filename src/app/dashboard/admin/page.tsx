'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { useTelemetryStore } from '@/stores/telemetryStore'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  BarChart3,
  Truck,
  DollarSign,
  Activity,
} from 'lucide-react'
import { products } from '@/data/mock'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { orders } = useOrderStore()
  const { agents, startSimulation, stopSimulation } = useTelemetryStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    startSimulation()
    return () => stopSimulation()
  }, [isAuthenticated, router, startSimulation, stopSimulation])

  if (!user) return null

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const activeDeliveries = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length
  const completedOrders = orders.filter((o) => o.status === 'delivered').length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  // Top products
  const productSales: Record<string, { name: string; image: string; qty: number; revenue: number }> = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = {
          name: item.product.name,
          image: item.product.image,
          qty: 0,
          revenue: 0,
        }
      }
      productSales[item.product.id].qty += item.quantity
      productSales[item.product.id].revenue += item.product.price * item.quantity
    })
  })

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  if (topProducts.length === 0) {
    products.slice(0, 5).forEach((p) => {
      topProducts.push({ name: p.name, image: p.image, qty: 0, revenue: 0 })
    })
  }

  const stats = [
    {
      label: 'Fatturato Totale',
      value: formatPrice(totalRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+12.5%',
    },
    {
      label: 'Ordini Totali',
      value: orders.length.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+8.2%',
    },
    {
      label: 'Consegne Attive',
      value: activeDeliveries.toString(),
      icon: <Truck className="w-6 h-6" />,
      color: 'bg-yellow-500',
      change: '+3',
    },
    {
      label: 'Agenti Online',
      value: agents.filter((a) => a.status !== 'offline').length.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '2 attivi',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Panoramica completa del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ordini Recenti</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {orders.length > 0 ? (
              orders.slice(-5).reverse().map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">#{order.id}</span>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                      <p className="font-bold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Nessun ordine ancora
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Prodotti Top</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {topProducts.map((product, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <span className="text-2xl">{product.image}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.qty} unità vendute</p>
                </div>
                <span className="font-bold text-gray-900">{formatPrice(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Stato Agenti</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {agents.map((agent) => (
              <div key={agent.agentId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{agent.agentName}</p>
                      <p className="text-sm text-gray-500">
                        {agent.deliveriesToday} consegne oggi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : agent.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {agent.status}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {Math.round(agent.speed)} km/h
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Metriche Chiave</h2>
            <Star className="w-5 h-5 text-gray-400" />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Ordini Pendenti</span>
              <span className="font-bold text-yellow-600">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Ordini Completati</span>
              <span className="font-bold text-green-600">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Valutazione Media</span>
              <span className="font-bold text-blue-600">
                {(agents.reduce((sum, a) => sum + a.rating, 0) / agents.length).toFixed(1)} ⭐
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Prodotti nel Catalogo</span>
              <span className="font-bold text-gray-900">{products.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
