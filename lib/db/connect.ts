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

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(process.env.MONGODB_URI as string)
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise
  return globalWithMongoose.mongoose.conn
}
