"use client"

import {useTheme} from "next-themes"
import {Moon, Sun} from "lucide-react"
import {useEffect, useState} from "react"

export function ThemeToggle() {
    const {theme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return <div className="size-8"/>
    }

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={isDark ? "Светлая тема" : "Тёмная тема"}
        >
            {isDark ? <Sun className="size-4"/> : <Moon className="size-4"/>}
        </button>
    )
}
