'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice } from '@/lib/utils'
import { PaymentMethod } from '@/types'
import { CheckCircle, CreditCard, Wallet, Banknote, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { createOrder } = useOrderStore()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = getTotal()
  const deliveryFee = subtotal >= 15 ? 0 : 2.50
  const total = subtotal + deliveryFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    if (!user?.address) {
      setIsProcessing(false)
      return
    }

    const newOrderId = createOrder(items, total, paymentMethod, user.address, notes)
    setOrderId(newOrderId)
    clearCart()
    setIsProcessing(false)
    setOrderComplete(true)
  }

  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ordine Confermato!</h1>
        <p className="text-gray-500 mb-2">
          Il tuo ordine <span className="font-mono font-bold text-blue-500">#{orderId}</span> è stato ricevuto.
        </p>
        <p className="text-gray-500 mb-8">Riceverai una notifica quando un agente prenderà in carico la consegna.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Traccia Ordine
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Continua lo Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Nessun articolo nel carrello</h1>
        <Link href="/shop" className="text-blue-500 hover:text-blue-600 font-medium">
          Torna allo Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Torna al carrello
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Indirizzo di Consegna</h2>
            {user?.address ? (
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-600">{user.address.street}</p>
                <p className="text-gray-600">{user.address.city}, {user.address.zip}</p>
              </div>
            ) : (
              <p className="text-red-500">Indirizzo non configurato. Contatta il supporto.</p>
            )}
          </div>

          {/* Delivery Notes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Note di Consegna</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Citofono, piano, istruzioni speciali..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metodo di Pagamento</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { value: 'cash' as PaymentMethod, icon: <Banknote className="w-5 h-5" />, label: 'Contanti' },
                { value: 'card' as PaymentMethod, icon: <CreditCard className="w-5 h-5" />, label: 'Carta' },
                { value: 'wallet' as PaymentMethod, icon: <Wallet className="w-5 h-5" />, label: 'Wallet' },
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method.icon}
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.image} {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotale</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Consegna</span>
                <span className={deliveryFee === 0 ? 'text-green-500' : ''}>
                  {deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Totale</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !user?.address}
              className="mt-6 w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Elaborazione...' : `Conferma Ordine - ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
