"use client"

import {useState} from "react"
import {Pencil, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {NoteForm} from "@/components/dashboard/NoteForm"
import type {Note} from "@/app/api/notes/types"
import dayjs from "dayjs"

interface NoteCardProps {
    note: Note
    onUpdate: (noteId: string, content: string) => void
    onDelete: (noteId: string) => void
    isUpdating?: boolean
}

export function NoteCard({note, onUpdate, onDelete, isUpdating}: NoteCardProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = () => {
        if (confirm("Удалить заметку?")) {
            onDelete(note.id)
        }
    }

    if (isEditing) {
        return (
            <NoteForm
                initialContent={note.content}
                onSubmit={(content) => {
                    onUpdate(note.id, content)
                    setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
                isPending={isUpdating}
            />
        )
    }

    return (
        <div className="group rounded-lg border border-border bg-card p-4 space-y-2">
            {note.content && (
                <p className="text-sm line-clamp-3 whitespace-pre-wrap">{note.content}</p>
            )}
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted-foreground/60">
                    {dayjs(note.updatedAt).format("DD.MM.YYYY HH:mm")}
                </p>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon-xs" onClick={() => setIsEditing(true)}>
                        <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-xs" onClick={handleDelete}>
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
