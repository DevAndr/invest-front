"use client"

import {useState, useCallback, useRef} from "react"
import {Upload, X, FileIcon, Plus, CheckCircle2, AlertCircle} from "lucide-react"
import {Button} from "@/components/ui/button"
import {formatFileSize} from "@/utils/formatFileSize"
import {useImportBatchCSV, type CompanyInfo, type BatchResultItem} from "@/app/api/upload/useImportBatchCSV"
import {Spinner} from "@/components/ui/spinner"
import {toast} from "sonner"

type FileEntry = {
    file: File
    companyName: string
    ticker: string
    industry: string
}

export default function BatchImportPage() {
    const [entries, setEntries] = useState<FileEntry[]>([])
    const [dragging, setDragging] = useState(false)
    const [results, setResults] = useState<BatchResultItem[] | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {mutate: importBatch, isPending} = useImportBatchCSV()

    const addFiles = useCallback((files: FileList | File[]) => {
        const newEntries: FileEntry[] = Array.from(files)
            .filter((f) => f.name.endsWith(".csv"))
            .map((file) => {
                const baseName = file.name.replace(/\.csv$/i, "")
                return {
                    file,
                    companyName: baseName,
                    ticker: "",
                    industry: "",
                }
            })

        if (newEntries.length === 0) {
            toast.error("Выберите CSV файлы")
            return
        }

        setEntries((prev) => [...prev, ...newEntries])
        setResults(null)
    }, [])

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

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragging(false)
            addFiles(e.dataTransfer.files)
        },
        [addFiles]
    )

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                addFiles(e.target.files)
            }
            if (fileInputRef.current) fileInputRef.current.value = ""
        },
        [addFiles]
    )

    const removeEntry = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index))
    }

    const updateEntry = (index: number, field: keyof CompanyInfo, value: string) => {
        setEntries((prev) =>
            prev.map((entry, i) =>
                i === index ? {...entry, [field]: value} : entry
            )
        )
    }

    const handleSubmit = () => {
        if (entries.length === 0) {
            toast.info("Добавьте хотя бы один файл")
            return
        }

        const hasEmpty = entries.some((e) => !e.companyName.trim())
        if (hasEmpty) {
            toast.error("Заполните название компании для всех файлов")
            return
        }

        importBatch(
            {
                files: entries.map((e) => e.file),
                companies: entries.map((e) => ({
                    companyName: e.companyName,
                    ticker: e.ticker,
                    industry: e.industry,
                })),
            },
            {
                onSuccess: (data) => {
                    setResults(data.results)
                    const totalImported = data.results.reduce((sum, r) => sum + r.imported, 0)
                    toast.success(`Импортировано ${totalImported} записей`)
                    setEntries([])
                },
                onError: (error) => {
                    toast.error(
                        (error.response?.data as any)?.message ?? "Ошибка импорта"
                    )
                },
            }
        )
    }

    const handleReset = () => {
        setEntries([])
        setResults(null)
    }

    console.log({results})

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Массовый импорт</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Загрузите несколько CSV файлов для импорта данных по компаниям
                </p>
            </div>

            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 cursor-pointer transition-colors ${
                    dragging
                        ? "border-ring bg-accent/50"
                        : "border-border hover:border-ring/50 hover:bg-muted/30"
                }`}
            >
                <Upload className={`size-10 ${dragging ? "text-ring" : "text-muted-foreground"}`}/>
                <div className="text-center">
                    <p className="text-sm font-medium">Перетащите CSV файлы сюда</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        или{" "}
                        <span className="text-primary underline underline-offset-2">выберите файлы</span>
                    </p>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* File entries */}
            {entries.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium">
                            Файлы ({entries.length})
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus className="size-4"/>
                            Ещё файлы
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {entries.map((entry, index) => (
                            <div
                                key={`${entry.file.name}-${index}`}
                                className="rounded-lg border border-border bg-card p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <FileIcon className="size-5 text-muted-foreground shrink-0 mt-0.5"/>
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium truncate">
                                                    {entry.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(entry.file.size)}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => removeEntry(index)}
                                            >
                                                <X className="size-4"/>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                value={entry.companyName}
                                                onChange={(e) =>
                                                    updateEntry(index, "companyName", e.target.value)
                                                }
                                                placeholder="Название компании *"
                                                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                            <input
                                                type="text"
                                                value={entry.ticker}
                                                onChange={(e) =>
                                                    updateEntry(index, "ticker", e.target.value.toUpperCase())
                                                }
                                                placeholder="Тикер"
                                                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono uppercase placeholder:text-muted-foreground placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                            <input
                                                type="text"
                                                value={entry.industry}
                                                onChange={(e) =>
                                                    updateEntry(index, "industry", e.target.value)
                                                }
                                                placeholder="Отрасль"
                                                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                        <Button variant="outline" onClick={handleReset} disabled={isPending}>
                            Очистить
                        </Button>
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {isPending && <Spinner data-icon="inline-start"/>}
                            Импортировать {entries.length} {entries.length === 1 ? "файл" : entries.length < 5 ? "файла" : "файлов"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="space-y-3">
                    <h2 className="text-sm font-medium">Результаты импорта</h2>
                    <div className="space-y-2">
                        {results.map((result, i) => {
                            const hasErrors = result.errors.length > 0
                            return (
                                <div
                                    key={result.company.id ?? i}
                                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                                        hasErrors
                                            ? "border-destructive/30 bg-destructive/5"
                                            : "border-green-500/30 bg-green-500/5"
                                    }`}
                                >
                                    {hasErrors ? (
                                        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5"/>
                                    ) : (
                                        <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">
                                            {result.company.name} ({result.company.ticker})
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Импортировано: {result.imported} | Пропущено: {result.skipped}
                                        </p>
                                        {hasErrors && (
                                            <ul className="mt-1 space-y-0.5">
                                                {result.errors.map((err, j) => (
                                                    <li key={j} className="text-xs text-destructive">
                                                        {err}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
