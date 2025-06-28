import { Link } from 'react-router-dom'
import { FileText, Users, Shield, Clock, Search, Zap } from 'lucide-react'

export const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: 'Rich Document Editor',
      description: 'Create beautiful documents with our powerful WYSIWYG editor featuring real-time collaboration.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Mention team members, share documents, and collaborate in real-time with advanced permission controls.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Keep your documents private or make them public. Full control over who can view and edit your content.',
    },
    {
      icon: Clock,
      title: 'Version History',
      description: 'Never lose your work. Track all changes with complete version history and restore previous versions.',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find any document instantly with full-text search across titles and content.',
    },
    {
      icon: Zap,
      title: 'Auto-Save',
      description: 'Focus on writing while we automatically save your work. Never worry about losing changes again.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DocCollab</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Collaborate on documents{' '}
            <span className="text-blue-600">like never before</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, edit, and share documents with your team. Real-time collaboration, 
            powerful editing tools, and secure sharing all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Writing for Free
            </Link>
            <Link
              to="/auth/signin"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              DocCollab provides all the tools your team needs to create, share, and collaborate on documents effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start collaborating?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using DocCollab to create amazing documents together.
          </p>
          <Link
            to="/auth/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-bold">DocCollab</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 DocCollab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}