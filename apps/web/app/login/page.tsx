'use client'

import { useState } from 'react'
import { login, signup } from '../lib/supabase/actions'
import { Button } from '@repo/ui/button'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface p-8 border border-gray-800 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">Antigravity</h1>
          <p className="mt-2 text-gray-400">
            {isLogin ? 'Welcome back! Track your habits.' : 'Start your journey today.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" action={async (formData) => {
          setLoading(true)
          if (isLogin) {
            await login(formData)
          } else {
            await signup(formData)
          }
          setLoading(false)
        }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:border-primary focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full py-4 text-lg font-bold" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
