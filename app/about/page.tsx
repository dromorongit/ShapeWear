import { Metadata } from 'next'
import Link from 'next/link'
import ContourLine from '@/components/ui/ContourLine'

export const metadata: Metadata = {
  title: 'About - Shapewear Closet',
  description: 'Learn about Shapewear Closet, a Ghana-based shapewear brand built on confidence, quality, and fit.',
}

const AboutPage = () => {
  return (
    <div className="relative overflow-hidden py-8 md:py-12">
      <div className="absolute inset-0 md:hidden">
        <ContourLine color="pink" opacity={0.12} className="h-full w-full translate-x-1/4 -translate-y-1/4" />
      </div>
      <div className="hidden md:block absolute inset-0">
        <ContourLine color="pink" opacity={0.1} className="h-full w-1/2 translate-x-1/3" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-h1 font-semibold text-ink">About Shapewear Closet</h1>
          <p className="mt-4 font-body text-body text-ink/70">
            Confidence starts from underneath. That is the belief that founded Shapewear Closet, and it is the belief that guides every piece we source, every fit we refine, and every customer we serve.
          </p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="font-display text-h2 font-semibold text-ink">Our Story</h2>
              <p className="mt-3 font-body text-body text-ink/70">
                Shapewear Closet was born in Accra, out of a simple observation: too many women in Ghana were settling for shapewear that rolled, squeezed, or simply did not fit right. We believed there had to be a better way to access high-quality, supportive garments without importing guesswork or paying luxury prices.
              </p>
              <p className="mt-3 font-body text-body text-ink/70">
                Today, we curate and deliver trusted shapewear across Ghana from our base in Ashongman Estate. Every product in our closet is selected for its construction, fabric, and fit, and we stand behind it with real stock availability and honest sizing guidance.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h2 font-semibold text-ink">What We Offer</h2>
              <p className="mt-3 font-body text-body text-ink/70">
                From waist trainers and body shapers to tummy control bodysuits, slimming leggings, and postpartum support wear, our collection is built for real bodies and real lives. We stock multiple shapes and sizes so you can find the right combination for your silhouette, and we make reordering easy when you need a replacement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-h2 font-semibold text-ink">Who We Serve</h2>
              <p className="mt-3 font-body text-body text-ink/70">
                Our customers are women who want support without sacrifice: support that smooths, lifts, and holds, but does not pinch, roll, or dig in. Whether you are dressing for a wedding, heading to the office, recovering after childbirth, or simply want a more confident silhouette under your favourite dress, Shapewear Closet is here for you.
              </p>
            </section>
          </div>

          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
            >
              Shop Our Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
