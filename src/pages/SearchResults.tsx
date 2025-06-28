import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, FileText, ArrowLeft } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { DocumentCard } from '../components/Dashboard/DocumentCard'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

type Document = Database['public']['Tables']['documents']['Row'] & {
  users: { username: string; full_name: string | null }
}

export const SearchResults = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchDocuments()
    }
  }, [query, user])

  const searchDocuments = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Search using PostgreSQL full-text search
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          users:author_id (
            username,
            full_name
          )
        `)
        .or(`
          and(search_text.fts.${query.replace(/\s+/g, '&')}, visibility.eq.public),
          and(search_text.fts.${query.replace(/\s+/g, '&')}, author_id.eq.${user.id}),
          search_text.fts.${query.replace(/\s+/g, '&')}
        `)
        .order('last_modified_at', { ascending: false })

      if (error) throw error

      // Filter out documents user doesn't have access to
      const accessibleDocs = []
      for (const doc of data || []) {
        if (doc.author_id === user.id || doc.visibility === 'public') {
          accessibleDocs.push(doc)
        } else {
          // Check if document is shared with user
          const { data: shareData } = await supabase
            .from('document_shares')
            .select('*')
            .eq('document_id', doc.id)
            .eq('user_id', user.id)
            .single()

          if (shareData) {
            accessibleDocs.push(doc)
          }
        }
      }

      setDocuments(accessibleDocs as Document[])
    } catch (error: any) {
      console.error('Error searching documents:', error)
      toast.error('Failed to search documents')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      setDocuments(docs => docs.filter(doc => doc.id !== documentId))
      toast.success('Document deleted successfully')
    } catch (error: any) {
      console.error('Error deleting document:', error)
      toast.error('Failed to delete document')
    }
  }

  const handleDuplicateDocument = async (documentId: string) => {
    try {
      const originalDoc = documents.find(doc => doc.id === documentId)
      if (!originalDoc || !user) return

      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: `${originalDoc.title} (Copy)`,
          content: originalDoc.content,
          author_id: user.id,
          visibility: 'private',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Document duplicated successfully')
      searchDocuments()
    } catch (error: any) {
      console.error('Error duplicating document:', error)
      toast.error('Failed to duplicate document')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-2">
            <Search className="h-6 w-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h1>
          </div>
          <p className="text-gray-600">
            Found {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Results */}
        {documents.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search query or check the spelling
            </p>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse all documents
            </Link>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={document.author_id === user?.id ? handleDeleteDocument : undefined}
                onDuplicate={handleDuplicateDocument}
                onShare={(id) => console.log('Share document:', id)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}