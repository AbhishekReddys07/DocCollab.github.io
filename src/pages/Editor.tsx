import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Share, Eye, EyeOff, Clock, ArrowLeft } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { DocumentEditor } from '../components/Editor/DocumentEditor'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

type Document = Database['public']['Tables']['documents']['Row']

export const Editor = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [title, setTitle] = useState('Untitled Document')
  const [content, setContent] = useState('{"type":"doc","content":[{"type":"paragraph"}]}')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const isNewDocument = id === 'new'

  useEffect(() => {
    if (isNewDocument) {
      setLoading(false)
      return
    }

    fetchDocument()
  }, [id, user])

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(async () => {
      await saveDocument()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer)
  }, [title, content, hasUnsavedChanges])

  const fetchDocument = async () => {
    if (!user || !id || isNewDocument) return

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Check if user has access to this document
      const hasAccess = data.author_id === user.id || 
                       data.visibility === 'public' ||
                       await checkDocumentAccess(id)

      if (!hasAccess) {
        toast.error('You do not have permission to access this document')
        navigate('/dashboard')
        return
      }

      setDocument(data)
      setTitle(data.title)
      setContent(data.content)
    } catch (error: any) {
      console.error('Error fetching document:', error)
      toast.error('Failed to load document')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const checkDocumentAccess = async (documentId: string) => {
    if (!user) return false

    const { data } = await supabase
      .from('document_shares')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .single()

    return !!data
  }

  const saveDocument = useCallback(async () => {
    if (!user) return

    setSaving(true)
    try {
      if (isNewDocument || !document) {
        // Create new document
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title,
            content,
            author_id: user.id,
            visibility: 'private',
          })
          .select()
          .single()

        if (error) throw error

        setDocument(data)
        navigate(`/editor/${data.id}`, { replace: true })
        
        // Save version
        await saveVersion(data.id)
      } else {
        // Update existing document
        const { error } = await supabase
          .from('documents')
          .update({
            title,
            content,
            last_modified_at: new Date().toISOString(),
          })
          .eq('id', document.id)

        if (error) throw error

        // Save version
        await saveVersion(document.id)
      }

      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      
    } catch (error: any) {
      console.error('Error saving document:', error)
      toast.error('Failed to save document')
    } finally {
      setSaving(false)
    }
  }, [user, title, content, document, isNewDocument, navigate])

  const saveVersion = async (documentId: string) => {
    if (!user) return

    try {
      await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          user_id: user.id,
          title,
          content,
        })
    } catch (error) {
      console.error('Error saving version:', error)
    }
  }

  const toggleVisibility = async () => {
    if (!document || !user || document.author_id !== user.id) return

    try {
      const newVisibility = document.visibility === 'private' ? 'public' : 'private'
      
      const { error } = await supabase
        .from('documents')
        .update({ visibility: newVisibility })
        .eq('id', document.id)

      if (error) throw error

      setDocument({ ...document, visibility: newVisibility })
      toast.success(`Document is now ${newVisibility}`)
    } catch (error: any) {
      console.error('Error updating visibility:', error)
      toast.error('Failed to update document visibility')
    }
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }

  const handleContentChange = (newContent: any) => {
    setContent(typeof newContent === 'string' ? newContent : JSON.stringify(newContent))
    setHasUnsavedChanges(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {saving ? (
                  <span className="flex items-center space-x-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                    <span>Saving...</span>
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center space-x-1">
                    <Save className="h-3 w-3 text-green-600" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </span>
                ) : hasUnsavedChanges ? (
                  <span className="text-orange-600">Unsaved changes</span>
                ) : null}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {document && document.author_id === user?.id && (
                <button
                  onClick={toggleVisibility}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {document.visibility === 'private' ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Public</span>
                    </>
                  )}
                </button>
              )}

              <button className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="h-4 w-4" />
                <span>History</span>
              </button>

              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DocumentEditor
            documentId={document?.id || null}
            title={title}
            content={content}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
          />
        </motion.div>
      </div>
    </div>
  )
}