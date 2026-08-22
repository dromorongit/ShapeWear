import Link from 'next/link'
import { FaTiktok } from 'react-icons/fa'
import { BUSINESS_NAME, TAGLINE, PHONE, EMAIL, LOCATION, TIKTOK } from '@/lib/constants'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/5 bg-blush/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-h2 font-semibold text-ink">{BUSINESS_NAME}</h3>
            <p className="mt-2 font-body text-body text-ink/60">{TAGLINE}</p>
          </div>

          <div>
            <h4 className="font-body text-h3 font-semibold text-ink">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`tel:${PHONE}`} className="font-body text-body text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  {PHONE}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${EMAIL}`} className="font-body text-body text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  {EMAIL}
                </Link>
              </li>
              <li className="font-body text-body text-ink/70">{LOCATION}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-h3 font-semibold text-ink">Follow Us</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={TIKTOK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-body text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                  <FaTiktok size={20} />
                  TikTok
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink/5 pt-8">
          <p className="font-body text-small text-ink/50">
            &copy; {currentYear} {BUSINESS_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
