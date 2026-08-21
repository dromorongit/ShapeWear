import { BUSINESS_NAME, PHONE } from './constants'

export const getWhatsAppUrl = (message?: string) => {
  const text = message || `Hi ${BUSINESS_NAME}! I'm interested in your shapewear. Could you please help me with more details?`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}
