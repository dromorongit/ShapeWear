import { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ContourLine from '@/components/ui/ContourLine'

export const metadata: Metadata = {
  title: 'About - Shapewear Closet',
  description: 'Learn about Shapewear Closet, a Ghana-based shapewear brand built on confidence, quality, and fit.',
}

const AboutPage = () => {
  return (
    <div className="relative overflow-hidden">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 md:hidden pointer-events-none">
          <ContourLine color="pink" opacity={0.15} className="h-full w-full translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <ContourLine color="pink" opacity={0.1} className="h-full w-1/2 translate-x-1/3" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <p className="font-body text-small font-medium uppercase tracking-wider text-pink mb-4">Our Story</p>
              <h1 className="font-display text-h1 font-semibold text-ink">
                Confidence starts from underneath.
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 font-body text-body text-ink/70 text-lg leading-relaxed">
                That is the belief that founded Shapewear Closet, and it is the belief that guides every piece we source, every fit we refine, and every customer we serve.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink/[0.02] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-display text-h2 font-semibold text-ink">What We Offer</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-4 font-body text-body text-ink/70 leading-relaxed">
                From waist trainers and body shapers to tummy control bodysuits, slimming leggings, and postpartum support wear, our collection is built for real bodies and real lives. We stock multiple shapes and sizes so you can find the right combination for your silhouette, and we make reordering easy when you need a replacement.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-display text-h2 font-semibold text-ink">Who We Serve</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-4 font-body text-body text-ink/70 leading-relaxed">
                Our customers are women who want support without sacrifice: support that smooths, lifts, and holds, but does not pinch, roll, or dig in. Whether you are dressing for a wedding, heading to the office, recovering after childbirth, or simply want a more confident silhouette under your favourite dress, Shapewear Closet is here for you.
              </p>
            </Reveal>

            <div className="mt-10">
              <Reveal>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
                >
                  Shop Our Collection
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
