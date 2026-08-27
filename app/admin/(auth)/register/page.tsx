import { connectDb } from '@/lib/db/connect'
import Admin from '@/lib/db/models/Admin'
import RegisterForm from '@/components/admin/RegisterForm'

export const dynamic = 'force-dynamic'

export default async function AdminRegisterPage() {
  await connectDb()
  const adminExists = (await Admin.countDocuments().exec()) > 0

  if (adminExists) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blush px-4">
        <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-soft text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Admin Account Already Created
          </h1>
          <p className="mt-2 font-body text-small text-ink/60">
            An admin account has already been created. Please log in instead.
          </p>
          <div className="mt-6">
            <a
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-md bg-pink px-6 py-3 font-body text-base font-medium text-white transition-colors hover:bg-pink/90"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blush px-4">
      <RegisterForm />
    </div>
  )
}
