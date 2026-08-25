import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin extends Document {
  email: string
  passwordHash: string
  singletonKey: string
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    singletonKey: { type: String, required: true, unique: true, default: 'admin-singleton' },
  },
  { timestamps: true }
)

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
