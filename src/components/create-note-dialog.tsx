'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Loader2, Plus } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import axios from 'axios'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from '@/hooks/use-toast'

const CreateNoteDialog = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [input, setInput] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post('/api/uploadToFirebase', {
        noteId,
      })
      return response.data
    },
  })

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/createNoteBook', {
        name: input,
      })
      return response.data
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input === '') {
      toast({
        variant: 'default',
        description: 'Please enter a name for your notebook.',
        duration: 1500,
      })
      return
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ noteId }) => {
        // hit another endpoint to uplod the temp dalle url to permanent firebase url
        uploadToFirebase.mutate(noteId)
        router.push(`/notebook/${noteId}`)
      },
      onError: (error) => {
        console.error(error)
        toast({
          variant: 'destructive',
          description: 'Failed to create new notebook.',
          duration: 1500,
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center
            justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4"
        >
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button
              type="reset"
              variant={'secondary'}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createNotebook.isLoading}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialog
