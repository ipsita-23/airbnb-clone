import { login, signup } from './actions'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams;
  const message = searchParams.message;

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <span className="font-medium">{message}</span>
            </div>
          )}

          <div className="flex items-center justify-between space-x-4">
            <button
              formAction={login}
              className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
