'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useTelemetryStore } from '@/stores/telemetryStore'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import {
  MapPin,
  Navigation,
  Battery,
  Clock,
  Truck,
  Zap,
  Target,
  Phone,
  MessageSquare,
} from 'lucide-react'

export default function TelemetryPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { agents, selectedAgent, setSelectedAgent, startSimulation, stopSimulation, isSimulating } = useTelemetryStore()
  const { orders } = useOrderStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
    startSimulation()
    return () => stopSimulation()
  }, [isAuthenticated, router, startSimulation, stopSimulation])

  if (!user) return null

  const selected = agents.find((a) => a.agentId === selectedAgent)
  const selectedOrders = selectedAgent
    ? orders.filter((o) => o.assignedAgentId === selectedAgent && !['delivered', 'cancelled'].includes(o.status))
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Telemetria in Tempo Reale</h1>
          <p className="text-gray-500 mt-1">Monitoraggio agenti e consegne</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
          />
          <span className="text-sm text-gray-500">
            {isSimulating ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-[500px] bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-blue-500"
                    style={{ top: `${i * 5}%` }}
                  />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-blue-500"
                    style={{ left: `${i * 5}%` }}
                  />
                ))}
              </div>

              {/* Agent markers */}
              {agents.map((agent) => {
                const x = ((agent.lng + 180) / 360) * 100
                const y = ((90 - agent.lat) / 180) * 100
                const isSelected = selectedAgent === agent.agentId

                return (
                  <button
                    key={agent.agentId}
                    onClick={() =>
                      setSelectedAgent(isSelected ? null : agent.agentId)
                    }
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
                      isSelected ? 'z-10 scale-125' : 'z-0'
                    }`}
                    style={{
                      left: `${((agent.lng - 9) / 0.05) * 50 + 50}%`,
                      top: `${((agent.lat - 45.44) / 0.05) * 50 + 50}%`,
                    }}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                        agent.status === 'available'
                          ? 'bg-green-500'
                          : agent.status === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      } ${isSelected ? 'ring-4 ring-white' : ''}`}
                    >
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 py-0.5 rounded-full">
                        {agent.agentName}
                      </span>
                    </div>
                    {agent.speed > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">
                          {Math.round(agent.speed)}
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm">
                <p className="text-xs font-semibold text-gray-700 mb-2">Legenda</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">Disponibile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-gray-600">In Consegna</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-400 rounded-full" />
                    <span className="text-xs text-gray-600">Offline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Agent List */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Agenti</h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <button
                  key={agent.agentId}
                  onClick={() =>
                    setSelectedAgent(
                      selectedAgent === agent.agentId ? null : agent.agentId
                    )
                  }
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    selectedAgent === agent.agentId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        agent.status === 'available'
                          ? 'bg-green-100'
                          : agent.status === 'busy'
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Truck
                        className={`w-5 h-5 ${
                          agent.status === 'available'
                            ? 'text-green-600'
                            : agent.status === 'busy'
                            ? 'text-yellow-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{agent.agentName}</p>
                      <p className="text-xs text-gray-500">
                        {agent.deliveriesToday} consegne oggi
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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
                </button>
              ))}
            </div>
          </div>

          {/* Selected Agent Details */}
          {selected && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dettagli: {selected.agentName}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Posizione</span>
                  </div>
                  <span className="text-sm font-mono">
                    {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Velocità</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(selected.speed)} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Batteria</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(selected.battery)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Ultimo Aggiornamento</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(selected.lastUpdate).toLocaleTimeString('it-IT')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Valutazione</span>
                  </div>
                  <span className="text-sm font-medium">
                    {selected.rating} ⭐
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600">
                  <Phone className="w-4 h-4" />
                  Chiama
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          )}

          {/* Active Orders for Selected Agent */}
          {selectedOrders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Consegne in Corso
              </h2>
              <div className="space-y-3">
                {selectedOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">#{order.id}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {order.items.map((item) => (
                        <span key={item.product.id} className="text-lg">
                          {item.product.image}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
