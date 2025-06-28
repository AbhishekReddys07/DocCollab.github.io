import { formatDistanceToNow } from 'date-fns'
import { FileText, Lock, Globe, Users, MoreVertical } from 'lucide-react'
import { Database } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Document = Database['public']['Tables']['documents']['Row'] & {
  users: { username: string; full_name: string | null }
}

interface DocumentCardProps {
  document: Document
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onShare?: (id: string) => void
}

export const DocumentCard = ({ document, onDelete, onDuplicate, onShare }: DocumentCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDocumentPreview = (content: string) => {
    try {
      const parsed = JSON.parse(content)
      // Extract text content from Tiptap JSON
      const extractText = (node: any): string => {
        if (node.type === 'text') {
          return node.text || ''
        }
        if (node.content) {
          return node.content.map(extractText).join('')
        }
        return ''
      }
      return extractText(parsed).slice(0, 150) + '...'
    } catch {
      return content.slice(0, 150) + '...'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <Link to={`/editor/${document.id}`} className="block p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900 truncate max-w-xs">
              {document.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            {document.visibility === 'private' ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {getDocumentPreview(document.content)}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>By {document.users?.full_name || document.users?.username}</span>
          </div>
          <span>
            Updated {formatDistanceToNow(new Date(document.last_modified_at))} ago
          </span>
        </div>
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault()
            setShowMenu(!showMenu)
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px] z-10"
            >
              {onShare && (
                <button
                  onClick={() => {
                    onShare(document.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Share</span>
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => {
                    onDuplicate(document.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Duplicate</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(document.id)
                    setShowMenu(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}