import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Header } from './components/Layout/Header'
import { AuthLayout } from './components/Auth/AuthLayout'
import { SignUpForm } from './components/Auth/SignUpForm'
import { SignInForm } from './components/Auth/SignInForm'
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'
import { SearchResults } from './pages/SearchResults'

const AppContent = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        
        {/* Auth routes */}
        <Route
          path="/auth/signup"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout title="Create your account" subtitle="Join DocCollab to start collaborating on documents">
                <SignUpForm />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/auth/signin"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout title="Welcome back" subtitle="Sign in to your DocCollab account">
                <SignInForm />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout title="Reset your password" subtitle="Enter your email to receive a reset link">
                <ForgotPasswordForm />
              </AuthLayout>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Header />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Header />
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Header />
              <SearchResults />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App