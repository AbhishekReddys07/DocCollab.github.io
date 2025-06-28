import { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <FileText className="h-12 w-12 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DocCollab</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}