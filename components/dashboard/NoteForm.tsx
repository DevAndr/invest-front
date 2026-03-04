"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"

interface NoteFormProps {
    initialContent?: string
    onSubmit: (content: string) => void
    onCancel: () => void
    isPending?: boolean
}

export function NoteForm({initialContent = "", onSubmit, onCancel, isPending}: NoteFormProps) {
    const [content, setContent] = useState(initialContent)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return
        onSubmit(content.trim())
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Текст заметки..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
                    Отмена
                </Button>
                <Button type="submit" size="sm" disabled={!content.trim() || isPending}>
                    {isPending ? "Сохранение..." : "Сохранить"}
                </Button>
            </div>
        </form>
    )
}
