import {FC, useState} from "react";
import {MessageSquare, Send, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import dayjs from "dayjs";
import {toast} from "sonner";
import {useGetNotes} from "@/app/api/notes/useGetNotes";
import {useCreateNote} from "@/app/api/notes/useCreateNote";
import {useDeleteNote} from "@/app/api/notes/useDeleteNote";

interface Props {
    companyId: string;
}

export const Notes: FC<Props> = ({companyId}) => {
    const [noteText, setNoteText] = useState("")
    const {data: notes} = useGetNotes(companyId)
    const {mutate: createNote, isPending: creatingNote} = useCreateNote()
    const {mutate: deleteNote} = useDeleteNote()

    const handleCreateNote = () => {
        if (!noteText.trim()) return
        createNote(
            {companyId, content: noteText.trim()},
            {
                onSuccess: () => {
                    setNoteText("")
                    toast.success("Заметка добавлена")
                },
            }
        )
    }

    const handleDeleteNote = (noteId: string) => {
        deleteNote(
            {companyId, noteId},
            {onSuccess: () => toast.success("Заметка удалена")}
        )
    }

    return  <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-muted-foreground"/>
            <h2 className="text-sm font-medium">Заметки</h2>
            {notes && notes.length > 0 && (
                <span className="text-xs text-muted-foreground">({notes.length})</span>
            )}
        </div>

        <div className="flex gap-2">
            <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
                placeholder="Добавить заметку..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="sm" onClick={handleCreateNote} disabled={creatingNote || !noteText.trim()}>
                {creatingNote ? <Spinner data-icon="inline-start"/> : <Send className="size-4"/>}
            </Button>
        </div>

        {notes && notes.length > 0 ? (
            <div className="space-y-2">
                {notes.map((note) => (
                    <div key={note.id} className="flex items-start gap-3 rounded-lg bg-muted/30 px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm">{note.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {note.user?.name ?? "Пользователь"} &middot; {dayjs(note.createdAt).format("DD.MM.YYYY HH:mm")}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="size-3.5"/>
                        </Button>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-xs text-muted-foreground">Нет заметок</p>
        )}
    </div>
}