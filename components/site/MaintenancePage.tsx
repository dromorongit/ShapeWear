import Image from 'next/image'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { BUSINESS_NAME } from '@/lib/constants'

interface MaintenancePageProps {
  message?: string
  estimatedReturn?: Date | null
}

export default function MaintenancePage({ message, estimatedReturn }: MaintenancePageProps) {
  const formattedReturn = estimatedReturn
    ? new Date(estimatedReturn).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blush px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft">
        <Image
          src="/images/Shapewearlogo.jpg"
          alt={BUSINESS_NAME}
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
      </div>

      <h1 className="font-display text-h1 text-ink">
        We&apos;ll Be Right Back
      </h1>

      <p className="mt-6 max-w-md font-body text-body text-ink/70">
        {message || "We're currently making some updates. Please check back shortly."}
      </p>

      {formattedReturn && (
        <p className="mt-4 font-body text-small text-ink/60">
          Expect us back by <span className="font-medium text-ink">{formattedReturn}</span>
        </p>
      )}

      <a
        href={getWhatsAppUrl('Hi Shapewear Closet! I need assistance while you are under maintenance.')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 font-body text-body font-medium text-white hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2"
      >
        <svg
          className="mr-2 h-5 w-5"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 1 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
        Contact us on WhatsApp
      </a>
    </div>
  )
}
