import Link from 'next/link'
import { FaTiktok } from 'react-icons/fa'
import { BUSINESS_NAME, TAGLINE, PHONE, EMAIL, LOCATION, TIKTOK } from '@/lib/constants'
import DeveloperCredits from '@/components/layout/DeveloperCredits'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink text-blush">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-h2 font-semibold text-white">{BUSINESS_NAME}</h3>
            <p className="mt-3 font-body text-body text-blush/70 leading-relaxed">
              {TAGLINE}. Supportive shapewear for every body, crafted for confidence from underneath.
            </p>
          </div>

          <div>
            <h4 className="font-body text-h3 font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  About
                </Link>
              </li>
               <li>
                 <Link href="/contact" className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                   Contact
                 </Link>
               </li>
               <li>
                 <Link href="/affiliate/register" className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                   Become an Affiliate
                 </Link>
               </li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-h3 font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link href={`tel:${PHONE}`} className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  {PHONE}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${EMAIL}`} className="font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  {EMAIL}
                </Link>
              </li>
              <li className="font-body text-body text-blush/70">{LOCATION}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-h3 font-semibold text-white mb-4">Follow Us</h4>
            <ul className="space-y-3">
              <li>
                <Link href={TIKTOK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-body text-body text-blush/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  <FaTiktok size={20} />
                  TikTok
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gold/30 pt-8">
          <p className="font-body text-small text-blush/50 text-center">
            &copy; {currentYear} {BUSINESS_NAME}. All rights reserved.
          </p>

          <DeveloperCredits />
        </div>
      </div>
    </footer>
  )
}

export default Footer
