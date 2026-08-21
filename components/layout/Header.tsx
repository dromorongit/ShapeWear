import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS_NAME } from '@/lib/constants'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/5 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Shapewear Closet Home">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo.png"
              alt={BUSINESS_NAME}
              width={32}
              height={32}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-display text-lg font-semibold text-ink">
            {BUSINESS_NAME}
          </span>
        </Link>

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-body text-body font-medium text-ink/70 hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <details className="md:hidden">
          <summary className="list-none flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-ink hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </summary>
          <nav className="absolute left-0 right-0 top-full border-b border-ink/5 bg-white px-4 py-4 shadow-sm" aria-label="Mobile">
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="font-body text-body font-medium text-ink/70 hover:text-pink">Home</Link></li>
              <li><Link href="/shop" className="font-body text-body font-medium text-ink/70 hover:text-pink">Shop</Link></li>
              <li><Link href="/about" className="font-body text-body font-medium text-ink/70 hover:text-pink">About</Link></li>
              <li><Link href="/contact" className="font-body text-body font-medium text-ink/70 hover:text-pink">Contact</Link></li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  )
}

export default Header
