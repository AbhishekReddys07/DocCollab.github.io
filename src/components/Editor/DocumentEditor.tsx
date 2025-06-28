import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Mention from '@tiptap/extension-mention'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { EditorToolbar } from './EditorToolbar'
import { MentionList } from './MentionList'

interface DocumentEditorProps {
  documentId: string | null
  title: string
  content: string
  onContentChange: (content: string) => void
  onTitleChange: (title: string) => void
}

export const DocumentEditor = ({
  documentId,
  title,
  content,
  onContentChange,
  onTitleChange,
}: DocumentEditorProps) => {
  const { user } = useAuth()
  const [users, setUsers] = useState<{ id: string; username: string; full_name: string | null }[]>([])

  // Fetch users for mentions
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name')
        .limit(50)

      if (error) {
        console.error('Error fetching users:', error)
        return
      }

      setUsers(data || [])
    }

    fetchUsers()
  }, [])

  const handleMentionCommand = useCallback(
    ({ query, range, command }: any) => {
      const filteredUsers = users
        .filter(user => 
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          (user.full_name && user.full_name.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 10)

      return {
        items: filteredUsers,
        command: ({ id, username }: { id: string; username: string }) => {
          command({ id, label: username })
          
          // Create mention in database if document exists
          if (documentId && user) {
            supabase
              .from('mentions')
              .insert({
                document_id: documentId,
                mentioned_user_id: id,
                mentioning_user_id: user.id,
              })
              .then(({ error }) => {
                if (error) {
                  console.error('Error creating mention:', error)
                }
              })
          }
        },
      }
    },
    [users, documentId, user]
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      CharacterCount,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: handleMentionCommand,
          render: () => {
            let component: any
            let popup: any

            return {
              onStart: (props: any) => {
                component = new MentionList({
                  props,
                  editor: props.editor,
                })

                if (!props.clientRect) {
                  return
                }

                popup = document.createElement('div')
                popup.className = 'mention-popup'
                document.body.appendChild(popup)
                component.render(popup)
              },

              onUpdate(props: any) {
                component.updateProps(props)

                if (!props.clientRect) {
                  return
                }

                const rect = props.clientRect()
                popup.style.top = `${rect.bottom + 8}px`
                popup.style.left = `${rect.left}px`
              },

              onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                  popup.remove()
                  return true
                }

                return component.onKeyDown(props)
              },

              onExit() {
                popup.remove()
                component.destroy()
              },
            }
          },
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[500px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getJSON())
    },
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Title Input */}
      <div className="p-6 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-400"
          placeholder="Untitled Document"
        />
      </div>

      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      {editor && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
          <span>
            {editor.storage.characterCount.characters()} characters, {editor.storage.characterCount.words()} words
          </span>
          <span className="text-xs text-gray-400">
            Use @ to mention users
          </span>
        </div>
      )}
    </div>
  )
}