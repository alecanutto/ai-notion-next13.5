'use client'
import React from 'react'
import axios from 'axios'
import Text from '@tiptap/extension-text'
import TipTapMenuBar from './tip-tap-meu-bar'
import { useCompletion } from 'ai/react'
import { useMutation } from '@tanstack/react-query'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Button } from './ui/button'
import { NoteType } from '@/lib/db/schema'
import { useDebounce } from '@/hooks/use-debounce'
import { useToast } from '@/hooks/use-toast'

type Props = { note: NoteType }

const TipTapEditor = ({ note }: Props) => {
  const { toast } = useToast()

  const [editorState, setEditorState] = React.useState(
    note.editorState || `<h1>${note.name}</h1>`,
  )
  const { complete, completion } = useCompletion({
    api: '/api/completion',
  })
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/saveNote', {
        noteId: note.id,
        editorState,
      })
      return response.data
    },
  })
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        'Shift-a': () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(' ').slice(-30).join(' ')
          complete(prompt)
          return true
        },
      }
    },
  })

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML())
    },
  })
  const lastCompletion = React.useRef('')

  React.useEffect(() => {
    if (!completion || !editor) return
    const diff = completion.slice(lastCompletion.current.length)
    lastCompletion.current = completion
    editor.commands.insertContent(diff)
  }, [completion, editor])

  const debouncedEditorState = useDebounce(editorState, 500)
  React.useEffect(() => {
    // save to db
    if (debouncedEditorState === '') return
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log('success update!', data)
      },
      onError: (err) => {
        console.error(err)
        toast({
          variant: 'destructive',
          description: 'Failed to update this notebook.',
          duration: 1500,
        })
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEditorState])
  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={'outline'}>
          {saveNote.isLoading ? 'Saving...' : 'Saved'}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{' '}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + A
        </kbd>{' '}
        for AI autocomplete
      </span>
    </>
  )
}

export default TipTapEditor
