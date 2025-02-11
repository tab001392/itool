import { redirect } from 'next/navigation'

import { onAuthenticateUser } from '@/actions/user'

export default async function AuthCallbackPage() {
  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201) return redirect(`/dashboard`)

  if (auth.status === 403 || auth.status === 400 || auth.status === 500)
    return redirect('/auth/sign-in')
}
