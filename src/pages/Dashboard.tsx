import { useEffect, useState } from 'react'
import { Plus, Search, Filter, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { DocumentCard } from '../components/Dashboard/DocumentCard'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

type Document = Database['public']['Tables']['documents']['Row'] & {
  users: { username: string; full_name: string | null }
}

export const Dashboard = () => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'my' | 'shared'>('all')

  useEffect(() => {
    fetchDocuments()
  }, [user])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchQuery, filter])

  const fetchDocuments = async () => {
    if (!user) return

    try {
      // Fetch user's own documents and shared documents
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          users:author_id (
            username,
            full_name
          )
        `)
        .or(`author_id.eq.${user.id},id.in.(${await getSharedDocumentIds()})`)
        .order('last_modified_at', { ascending: false })

      if (error) throw error
      setDocuments(data as Document[])
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const getSharedDocumentIds = async () => {
    if (!user) return ''
    
    const { data } = await supabase
      .from('document_shares')
      .select('document_id')
      .eq('user_id', user.id)

    return data?.map(share => share.document_id).join(',') || 'none'
  }

  const filterDocuments = () => {
    let filtered = documents

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply ownership filter
    if (filter === 'my') {
      filtered = filtered.filter(doc => doc.author_id === user?.id)
    } else if (filter === 'shared') {
      filtered = filtered.filter(doc => doc.author_id !== user?.id)
    }

    setFilteredDocuments(filtered)
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
      fetchDocuments()
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
          <p className="text-gray-600">Loading your documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Documents</h1>
          <p className="text-gray-600">Create, edit, and collaborate on documents with your team.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'my' | 'shared')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Documents</option>
                <option value="my">My Documents</option>
                <option value="shared">Shared with Me</option>
              </select>
            </div>
            
            <Link
              to="/editor/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Document</span>
            </Link>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query or filters'
                : 'Get started by creating your first document'
              }
            </p>
            {!searchQuery && (
              <Link
                to="/editor/new"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Document</span>
              </Link>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDocuments.map((document) => (
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