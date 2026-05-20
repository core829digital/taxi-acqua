'use client'

import { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Star, Plus } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex items-center justify-center h-48">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </span>
        {product.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
            POPOLARE
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-gray-500 font-medium">Esaurito</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        {product.volume && (
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full mb-3">
            {product.volume}
          </span>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>Aggiunto!</>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Aggiungi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
