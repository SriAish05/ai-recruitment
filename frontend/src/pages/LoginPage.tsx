import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { authApi } from '@/api/auth'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>
type Mode = 'login' | 'register'

function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from?: unknown }).from
    if (typeof from === 'string' && from.startsWith('/') && from !== '/login') return from
  }
  return '/dashboard'
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setToken = useAuthStore((s) => s.setToken)
  const [mode, setMode] = useState<Mode>('login')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      mode === 'login' ? authApi.login(values) : authApi.register(values),
    onSuccess: (data) => {
      setToken(data.token)
      navigate(getRedirectPath(location.state), { replace: true })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, mode === 'login' ? 'Sign in failed' : 'Registration failed'))
    },
  })

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const isLogin = mode === 'login'

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-[400px]"
      >
        <Card>
          <CardHeader className="space-y-4">
            <Logo showWordmark={false} />
            <div className="space-y-1.5">
              <CardTitle className="text-lg">
                {isLogin ? 'Sign in to Recruit' : 'Create your account'}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? 'Enter your credentials to continue.'
                  : 'Choose a username and password to get started.'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  autoFocus
                  aria-invalid={errors.username ? true : undefined}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  {...register('username')}
                />
                {errors.username && (
                  <p id="username-error" className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                {isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'No account yet?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(isLogin ? 'register' : 'login')
                  mutation.reset()
                }}
                className="rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </CardFooter>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          AI Recruitment Management System
        </p>
      </motion.div>
    </div>
  )
}
