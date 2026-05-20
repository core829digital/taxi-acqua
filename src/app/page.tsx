'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { products } from '@/data/mock'
import ProductCard from '@/components/ProductCard'
import {
  Droplets,
  Truck,
  Clock,
  Shield,
  ArrowRight,
  Star,
  CheckCircle,
  Smartphone,
  MapPin,
  CreditCard,
} from 'lucide-react'

export default function Home() {
  const { isAuthenticated, user } = useAuthStore()
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-6 backdrop-blur-sm">
                <Truck className="w-4 h-4" />
                Consegna in 30 minuti
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                L&apos;acqua fresca
                <span className="block text-yellow-300">a casa tua</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Ordina acqua e bibite con un click. I nostri agenti TaxiAcqua consegnano direttamente alla tua porta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Ordina Ora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    Registrati Gratis
                  </Link>
                )}
              </div>
              {isAuthenticated && (
                <p className="mt-4 text-blue-100">
                  Bentornato, <span className="font-semibold text-white">{user?.name}</span>!
                </p>
              )}
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <span className="text-9xl">💧</span>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-4xl">🚗</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck className="w-6 h-6" />,
                title: 'Consegna Veloce',
                desc: 'Ricevi il tuo ordine in 30 minuti',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Orari Flessibili',
                desc: 'Ordina quando vuoi, 7 giorni su 7',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Pagamento Sicuro',
                desc: 'Contanti, carta o wallet digitale',
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: 'Tracking Live',
                desc: 'Segui il tuo ordine in tempo reale',
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Prodotti Popolari</h2>
              <p className="text-gray-500 mt-1">I più scelti dai nostri clienti</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
            >
              Vedi tutti
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-blue-500 font-medium"
            >
              Vedi tutti i prodotti
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Come Funziona</h2>
            <p className="text-gray-500 mt-2">Tre semplici passaggi per ricevere la tua acqua</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <Smartphone className="w-8 h-8" />,
                title: 'Scegli i Prodotti',
                desc: 'Sfoglia il catalogo e aggiungi al carrello acqua e bibite',
              },
              {
                step: '2',
                icon: <CreditCard className="w-8 h-8" />,
                title: 'Conferma l&apos;Ordine',
                desc: 'Seleziona il metodo di pagamento e conferma',
              },
              {
                step: '3',
                icon: <MapPin className="w-8 h-8" />,
                title: 'Ricevi a Casa',
                desc: 'Segui il corriere in tempo reale e ricevi la consegna',
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pronto per ordinare?
          </h2>
          <p className="text-gray-700 mb-8 max-w-lg mx-auto">
            Unisciti a migliaia di clienti soddisfatti. Consegna veloce, prezzi convenienti.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Inizia Ora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Cosa Dicono i Clienti</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Anna M.',
                text: 'Servizio fantastico! Acqua fresca consegnata in 20 minuti. Consiglio vivamente.',
                rating: 5,
              },
              {
                name: 'Roberto C.',
                text: 'Comodissimo per le feste. Ordino sempre il cesto da 6 bottiglie.',
                rating: 5,
              },
              {
                name: 'Elena P.',
                text: 'App facile da usare e agenti sempre gentili. Ottima esperienza.',
                rating: 4,
              },
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${
                        j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&ldquo;{review.text}&rdquo;</p>
                <p className="font-semibold text-gray-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
