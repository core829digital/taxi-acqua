import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'In attesa',
    confirmed: 'Confermato',
    preparing: 'In preparazione',
    'picked-up': 'Ritirato',
    'in-transit': 'In transito',
    delivered: 'Consegnato',
    cancelled: 'Annullato',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    'picked-up': 'bg-indigo-100 text-indigo-800',
    'in-transit': 'bg-cyan-100 text-cyan-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    customer: 'Cliente',
    agent: 'Agente',
    admin: 'Amministratore',
  }
  return labels[role] || role
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    customer: 'bg-blue-500',
    agent: 'bg-yellow-500',
    admin: 'bg-red-500',
  }
  return colors[role] || 'bg-gray-500'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
