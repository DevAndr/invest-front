import React, {FC, RefObject, useCallback, useState} from 'react';
import {Upload} from "lucide-react";

interface Props {
    fileInputRef:  RefObject<HTMLInputElement | null>
    addFiles: (files: FileList | File[]) => void
};

export const DragonDropFiles: FC<Props> = ({fileInputRef, addFiles}) => {
    const [dragging, setDragging] = useState(false)

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

    return (
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

    );
};