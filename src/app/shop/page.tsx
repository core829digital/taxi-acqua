'use client'

import { useState } from 'react'
import { products } from '@/data/mock'
import { ProductCategory } from '@/types'
import ProductCard from '@/components/ProductCard'
import { Search, Filter, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories: { value: ProductCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Tutti', icon: '🛒' },
  { value: 'acqua', label: 'Acqua', icon: '💧' },
  { value: 'bibite', label: 'Bibite', icon: '🥤' },
  { value: 'soft-drinks', label: 'Soft Drinks', icon: '🍋' },
  { value: 'energy', label: 'Energy', icon: '⚡' },
  { value: 'premium', label: 'Premium', icon: '✨' },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'rating'>('rating')

  const filtered = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Catalogo Prodotti</h1>
        <p className="text-gray-500 mt-1">Scegli tra acqua e bibite per la tua consegna</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca prodotti..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="rating">Più votati</option>
          <option value="name">A-Z</option>
          <option value="price-asc">Prezzo: basso ad alto</option>
          <option value="price-desc">Prezzo: alto a basso</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === cat.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">{filtered.length} prodotti trovati</p>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun prodotto trovato</h3>
          <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  )
}
