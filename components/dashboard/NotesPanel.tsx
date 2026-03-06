"use client"

import {useState} from "react"
import {Loader2, Plus, StickyNote} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet"
import {NoteCard} from "@/components/dashboard/NoteCard"
import {NoteForm} from "@/components/dashboard/NoteForm"
import {useGetNotes} from "@/app/api/notes/useGetNotes"
import {useCreateNote} from "@/app/api/notes/useCreateNote"
import {useUpdateNote} from "@/app/api/notes/useUpdateNote"
import {useDeleteNote} from "@/app/api/notes/useDeleteNote"
import {Spinner} from "@/components/ui/spinner";

interface NotesPanelProps {
    companyId: string | null
    companyName: string
    open: boolean
    onClose: () => void
}

export function NotesPanel({companyId, companyName, open, onClose}: NotesPanelProps) {
    const [isCreating, setIsCreating] = useState(false)

    const {data: notes, isLoading} = useGetNotes(companyId)
    const {mutate: createNote, isPending: isCreatePending} = useCreateNote()
    const {mutate: updateNote, isPending: isUpdatePending} = useUpdateNote()
    const {mutate: deleteNote} = useDeleteNote()

    const handleCreate = (content: string) => {
        if (!companyId) return
        createNote({companyId, content}, {
            onSuccess: () => setIsCreating(false),
        })
    }

    const handleUpdate = (noteId: string, content: string) => {
        if (!companyId) return
        updateNote({companyId, noteId, content})
    }

    const handleDelete = (noteId: string) => {
        if (!companyId) return
        deleteNote({companyId, noteId})
    }

    return (
        <Sheet open={open} onOpenChange={(value) => {
            if (!value) {
                onClose()
                setIsCreating(false)
            }
        }}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Заметки — {companyName}</SheetTitle>
                    <SheetDescription>Заметки по компании</SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setIsCreating(true)}
                        disabled={isCreating}
                    >
                        <Plus className="size-4 mr-2" />
                        Добавить заметку
                    </Button>

                    {isCreating && (
                        <NoteForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreating(false)}
                            isPending={isCreatePending}
                        />
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner />
                        </div>
                    ) : !notes || notes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <StickyNote className="size-10 mb-3 opacity-30" />
                            <p className="text-sm">Нет заметок</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                    isUpdating={isUpdatePending}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
