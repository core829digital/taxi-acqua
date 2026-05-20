import { create } from 'zustand'
import { AgentTelemetry } from '@/types'
import { mockAgents } from '@/data/mock'

interface TelemetryState {
  agents: AgentTelemetry[]
  selectedAgent: string | null
  setSelectedAgent: (agentId: string | null) => void
  updateAgentPosition: (agentId: string, lat: number, lng: number) => void
  getAgentById: (agentId: string) => AgentTelemetry | undefined
  getAvailableAgents: () => AgentTelemetry[]
  startSimulation: () => void
  stopSimulation: () => void
  isSimulating: boolean
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  agents: mockAgents,
  selectedAgent: null,
  isSimulating: false,

  setSelectedAgent: (agentId: string | null) => {
    set({ selectedAgent: agentId })
  },

  updateAgentPosition: (agentId: string, lat: number, lng: number) => {
    set((state) => ({
      agents: state.agents.map((a) =>
        a.agentId === agentId
          ? { ...a, lat, lng, lastUpdate: new Date().toISOString() }
          : a
      ),
    }))
  },

  getAgentById: (agentId: string) => {
    return get().agents.find((a) => a.agentId === agentId)
  },

  getAvailableAgents: () => {
    return get().agents.filter((a) => a.status === 'available')
  },

  startSimulation: () => {
    set({ isSimulating: true })
    const interval = setInterval(() => {
      set((state) => ({
        agents: state.agents.map((agent) => {
          if (agent.status === 'offline') return agent
          const deltaLat = (Math.random() - 0.5) * 0.001
          const deltaLng = (Math.random() - 0.5) * 0.001
          const newSpeed = agent.status === 'busy' ? Math.random() * 50 + 10 : 0
          return {
            ...agent,
            lat: agent.lat + deltaLat,
            lng: agent.lng + deltaLng,
            speed: newSpeed,
            heading: (agent.heading + Math.random() * 30 - 15 + 360) % 360,
            battery: Math.max(0, agent.battery - Math.random() * 0.1),
            lastUpdate: new Date().toISOString(),
          }
        }),
      }))
    }, 2000)

    ;(globalThis as any).__telemetryInterval = interval
  },

  stopSimulation: () => {
    set({ isSimulating: false })
    if ((globalThis as any).__telemetryInterval) {
      clearInterval((globalThis as any).__telemetryInterval)
    }
  },
}))
