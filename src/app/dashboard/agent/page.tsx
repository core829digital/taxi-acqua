'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { useTelemetryStore } from '@/stores/telemetryStore'
import { useChatStore } from '@/stores/chatStore'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import {
  MapPin,
  Navigation,
  Battery,
  Clock,
  Package,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Phone,
  Send,
} from 'lucide-react'
import Link from 'next/link'

export default function AgentDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { orders, getOrdersByAgent, updateOrderStatus } = useOrderStore()
  const { agents, selectedAgent, setSelectedAgent, startSimulation, stopSimulation, isSimulating } = useTelemetryStore()
  const { conversations, setActiveConversation } = useChatStore()
  const [activeTab, setActiveTab] = useState<'deliveries' | 'map' | 'chat'>('deliveries')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    startSimulation()
    return () => stopSimulation()
  }, [isAuthenticated, router, startSimulation, stopSimulation])

  if (!user) return null

  const myOrders = orders.filter((o) => o.assignedAgentId === user.id)
  const activeDeliveries = myOrders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const completedToday = myOrders.filter((o) => o.status === 'delivered').length
  const myAgent = agents.find((a) => a.agentId === user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Agente
          </h1>
          <p className="text-gray-500 mt-1">Gestisci le tue consegne</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              myAgent?.status === 'available'
                ? 'bg-green-100 text-green-700'
                : myAgent?.status === 'busy'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {myAgent?.status === 'available' ? 'Disponibile' : myAgent?.status === 'busy' ? 'In Consegna' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeDeliveries.length}</p>
          <p className="text-sm text-gray-500">Consegne Attive</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
          <p className="text-sm text-gray-500">Completate Oggi</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white mb-3">
            <Star className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{myAgent?.rating || 4.8}</p>
          <p className="text-sm text-gray-500">Valutazione</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white mb-3">
            <Battery className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(myAgent?.battery || 90)}%</p>
          <p className="text-sm text-gray-500">Batteria</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'deliveries' as const, label: 'Consegne', icon: <Package className="w-4 h-4" /> },
          { id: 'map' as const, label: 'Mappa', icon: <MapPin className="w-4 h-4" /> },
          { id: 'chat' as const, label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="font-bold text-gray-900">#{order.id}</span>
                    <span
                      className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Indirizzo</p>
                    <p className="font-medium text-gray-900">{order.deliveryAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.city}, {order.deliveryAddress.zip}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Prodotti</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span key={item.product.id} className="text-sm">
                          {item.product.image} {item.product.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {order.deliveryNotes && (
                  <div className="p-3 bg-yellow-50 rounded-xl mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {order.deliveryNotes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Conferma
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600"
                    >
                      <Package className="w-4 h-4" />
                      Prepara
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'picked-up')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600"
                    >
                      <Navigation className="w-4 h-4" />
                      Ritira
                    </button>
                  )}
                  {order.status === 'picked-up' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'in-transit')}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600"
                    >
                      <Navigation className="w-4 h-4" />
                      In Transito
                    </button>
                  )}
                  {order.status === 'in-transit' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Consegnato
                    </button>
                  )}
                  {!['delivered', 'cancelled'].includes(order.status) && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                      Annulla
                    </button>
                  )}
                  <Link
                    href="/chat"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                    <Phone className="w-4 h-4" />
                    Chiama
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna consegna attiva</h3>
              <p className="text-gray-500">Le nuove assegnazioni appariranno qui</p>
            </div>
          )}
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-cyan-50 relative flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900">Mappa Telemetria</p>
              <p className="text-gray-500">Posizione agenti in tempo reale</p>
              <div className="mt-4 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {agents.map((agent) => (
                  <div key={agent.agentId} className="p-3 bg-white rounded-xl shadow-sm">
                    <p className="font-medium text-gray-900">{agent.agentName}</p>
                    <p className="text-xs text-gray-500">
                      Lat: {agent.lat.toFixed(4)}, Lng: {agent.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">Velocità: {Math.round(agent.speed)} km/h</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                        agent.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : agent.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversazioni</h3>
          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Link
                  key={conv.id}
                  href="/chat"
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {conv.orderId ? `Ordine #${conv.orderId}` : 'Conversazione'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.content || 'Nessun messaggio'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessuna conversazione</p>
          )}
        </div>
      )}
    </div>
  )
}
