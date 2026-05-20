'use client'

import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Il tuo carrello è vuoto</h2>
        <p className="text-gray-500 mb-8">Aggiungi prodotti per iniziare il tuo ordine</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
        >
          Vai allo Shop
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  const subtotal = getTotal()
  const deliveryFee = subtotal >= 15 ? 0 : 2.50
  const total = subtotal + deliveryFee

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Carrello ({getItemCount()} {getItemCount() === 1 ? 'articolo' : 'articoli'})
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          Svuota carrello
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">{item.product.image}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-sm text-gray-500">{item.product.volume}</p>
                <p className="font-bold text-blue-500 mt-1">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Riepilogo Ordine</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotale</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Consegna</span>
                <span className={deliveryFee === 0 ? 'text-green-500 font-medium' : ''}>
                  {deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-blue-500 bg-blue-50 p-2 rounded-lg">
                  Consegna gratis per ordini sopra €15!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Totale</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <Link
                href="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Procedi al Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
              >
                Accedi per Ordinare
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
