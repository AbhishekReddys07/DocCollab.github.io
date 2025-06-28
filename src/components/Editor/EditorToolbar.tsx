import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const toolbarButtons = [
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      title: 'Undo',
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      title: 'Redo',
      disabled: !editor.can().redo(),
    },
    { type: 'separator' },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      title: 'Heading 1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'Heading 2',
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: 'Heading 3',
    },
    { type: 'separator' },
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Bold',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Italic',
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Strikethrough',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: 'Inline Code',
    },
    { type: 'separator' },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Bullet List',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Ordered List',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      title: 'Blockquote',
    },
  ]

  return (
    <div className="flex items-center space-x-1 p-4 border-b border-gray-200 bg-gray-50 overflow-x-auto">
      {toolbarButtons.map((button, index) => {
        if (button.type === 'separator') {
          return <div key={index} className="w-px h-6 bg-gray-300 mx-2" />
        }

        const Icon = button.icon
        return (
          <button
            key={index}
            onClick={button.action}
            disabled={button.disabled}
            title={button.title}
            className={`p-2 rounded-md transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              button.isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}