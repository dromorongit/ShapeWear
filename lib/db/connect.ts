import mongoose from 'mongoose'

const globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    promise: Promise<typeof mongoose> | null
    conn: typeof mongoose | null
  }
}

globalWithMongoose.mongoose = globalWithMongoose.mongoose ?? { promise: null, conn: null }

export async function connectDb() {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn
  }

  const uri =
    process.env.MONGODB_URI ?? process.env.MONGO_URL ?? process.env.MONGODB_URL

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Provide MONGODB_URI (or MONGO_URL / MONGODB_URL) in your environment or Railway service variables.'
    )
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(uri)
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise
  return globalWithMongoose.mongoose.conn
}
