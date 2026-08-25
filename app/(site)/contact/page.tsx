import { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ContourLine from '@/components/ui/ContourLine'
import { BUSINESS_NAME, TAGLINE, PHONE, EMAIL, LOCATION, TIKTOK } from '@/lib/constants'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contact - Shapewear Closet',
  description: `Reach out to ${BUSINESS_NAME}. We're based in ${LOCATION}. Call us on ${PHONE} or email ${EMAIL}.`,
}

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.28 8.28 0 004.76 1.52V6.87a4.85 4.85 0 01-1-.18z" />
  </svg>
)

const ContactPage = () => {
  return (
    <div className="relative overflow-hidden">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 md:hidden pointer-events-none">
          <ContourLine color="pink" opacity={0.12} className="h-full w-full translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <ContourLine color="pink" opacity={0.1} className="h-full w-1/2 translate-x-1/3" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal>
                <div>
                  <p className="font-body text-small font-medium uppercase tracking-wider text-pink mb-3">Get in Touch</p>
                  <h1 className="font-display text-h1 font-semibold text-ink">Contact Us</h1>
                  <p className="mt-4 font-body text-body text-ink/70 max-w-xl leading-relaxed">
                    {TAGLINE}. We&apos;d love to hear from you — reach out anytime.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="mt-10 rounded-md border border-ink/5 bg-white p-6 shadow-soft">
                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-pink">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-small font-medium text-ink/60 mb-1">Phone</p>
                        <Link href={`tel:${PHONE}`} className="font-body text-body text-ink hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                          {PHONE}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-pink">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-small font-medium text-ink/60 mb-1">Email</p>
                        <Link href={`mailto:${EMAIL}`} className="font-body text-body text-ink hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                          {EMAIL}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-pink">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-small font-medium text-ink/60 mb-1">Location</p>
                        <p className="font-body text-body text-ink">{LOCATION}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-pink">
                        <TikTokIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="font-body text-small font-medium text-ink/60 mb-1">TikTok</p>
                        <Link href={TIKTOK} target="_blank" rel="noopener noreferrer" className="font-body text-body text-ink hover:text-pink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 rounded-sm">
                          @shapewear_closet
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-6">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 lg:w-auto"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative h-full w-full max-w-md">
                <ContourLine color="pink" opacity={0.15} className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
