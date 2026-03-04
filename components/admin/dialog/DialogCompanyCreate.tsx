"use client"

import {useState, useCallback, useRef} from "react"
import {Upload, X, FileIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {formatFileSize} from "@/utils/formatFileSize";

interface DialogCompanyCreateProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DialogCompanyCreate({open, onOpenChange}: DialogCompanyCreateProps) {
    const [companyName, setCompanyName] = useState("")
    const [ticker, setTicker] = useState("")
    const [industry, setIndustry] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [dragging, setDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            setFile(droppedFile)
        }
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }, [])

    const handleRemoveFile = useCallback(() => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: отправка данных
        console.log({companyName, ticker, industry, file})
        onOpenChange(false)
        resetForm()
    }

    const resetForm = () => {
        setCompanyName("")
        setTicker("")
        setIndustry("")
        setFile(null)
    }

    return (
        <Dialog open={open} onOpenChange={(value) => {
            onOpenChange(value)
            if (!value) resetForm()
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Добавить компанию</DialogTitle>
                    <DialogDescription>
                        Заполните информацию о новой компании
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="companyName" className="text-sm font-medium">
                            Название компании
                        </label>
                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Например, Газпром"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="ticker" className="text-sm font-medium">
                            Тикер
                        </label>
                        <input
                            id="ticker"
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            placeholder="Например, GAZP"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono uppercase placeholder:text-muted-foreground placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="industry" className="text-sm font-medium">
                            Отрасль
                        </label>
                        <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="Например, Энергетика"
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Файл</label>
                        {file ? (
                            <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-3">
                                <FileIcon className="size-5 text-muted-foreground shrink-0"/>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={handleRemoveFile}
                                >
                                    <X className="size-4"/>
                                </Button>
                            </div>
                        ) : (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 cursor-pointer transition-colors ${
                                    dragging
                                        ? "border-ring bg-accent/50"
                                        : "border-border hover:border-ring/50 hover:bg-muted/30"
                                }`}
                            >
                                <Upload className={`size-8 ${dragging ? "text-ring" : "text-muted-foreground"}`}/>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Перетащите файл сюда или{" "}
                                        <span className="text-primary underline underline-offset-2">выберите</span>
                                    </p>
                                </div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Отмена
                        </Button>
                        <Button type="submit">
                            Добавить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
