import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
            <Image
              src="/images/hero/shapewearhero.jpg"
              alt="Model wearing shapewear from Shapewear Closet"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-md bg-ink/70 px-4 py-2.5 backdrop-blur">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-white">
                Shapewear · Confidence · Everyday Wear
              </span>
              <span className="font-mono text-xs text-white">01</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4 sm:gap-6">
          <Reveal delay={150}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
              <Image
                src="/images/hero/shapewear1.jpg"
                alt="Shapewear detail"
                fill
                sizes="(max-width: 768px) 45vw, 25vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
              <Image
                src="/images/hero/shapewear2.jpg"
                alt="Shapewear detail"
                fill
                sizes="(max-width: 768px) 45vw, 25vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Reveal>
            <h1 className="text-hero text-ink relative inline-block tracking-tight">
              Confidence starts from underneath
              <span className="absolute -bottom-3 left-1/2 h-1 w-20 -translate-x-1/2 bg-gold rounded-full" aria-hidden="true" />
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 font-body text-xl md:text-2xl text-ink/70 max-w-xl mx-auto">
              Precision-cut shapewear that supports your silhouette and moves with your life - no squeezing, no slipping, just seamless confidence.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
              >
                Shop Now
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
