'use client'
import React from 'react'
import { Button } from './ui/button'
import { Loader2, Trash } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

type Props = {
  noteId: number
}

const DeleteButton = ({ noteId }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/deleteNote', {
        noteId,
      })
      return response.data
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    deleteNote.mutate(undefined, {
      onSuccess: () => {
        router.push('/dashboard')
      },
      onError: (err) => {
        console.error(err)
        toast({
          variant: 'destructive',
          description: 'Failed to delete this notebook.',
          duration: 1500,
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant={'destructive'}
          size="sm"
          disabled={deleteNote.isLoading}
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note Book</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete thi note?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              disabled={deleteNote.isLoading}
            >
              {deleteNote.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteButton
