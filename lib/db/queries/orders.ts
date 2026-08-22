import Order from '@/lib/db/models/Order'

export async function getOrderByPhone(phone: string) {
  return Order.findOne({ phone }).lean().exec()
}

export async function getOrderByPaystackReference(reference: string) {
  return Order.findOne({ paystackReference: reference }).lean().exec()
}

export async function createOrder(input: Parameters<typeof Order.create>[0]) {
  return Order.create(input)
}
