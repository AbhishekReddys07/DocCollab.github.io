import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface MentionListProps {
  props: {
    items: Array<{ id: string; username: string; full_name: string | null }>
    command: (item: { id: string; username: string }) => void
  }
  editor: any
}

export const MentionList = forwardRef<any, MentionListProps>(({ props, editor }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command({ id: item.id, username: item.username })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 max-w-xs">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={item.id}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="font-medium">@{item.username}</div>
            {item.full_name && (
              <div className="text-xs text-gray-500">{item.full_name}</div>
            )}
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-500">No users found</div>
      )}
    </div>
  )
})

MentionList.displayName = 'MentionList'