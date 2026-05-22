import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/favicon.png"
                alt="TaxiAcqua"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Consegna acqua e bibite a domicilio, veloce e affidabile. Il tuo taxi per l&apos;acqua fresca.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">Prodotti</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">I Miei Ordini</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Come Funziona</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Zone Coperte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Supporto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contattaci</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                +39 02 1234567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                info@taxiacqua.it
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                Milano, Italia
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors text-xs font-bold">
                f
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-colors text-xs font-bold">
                ig
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors text-xs font-bold">
                x
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaxiAcqua. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
