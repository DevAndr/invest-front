"use client"

import {useGetNews} from "@/app/api/news/useGetNews"
import {Spinner} from "@/components/ui/spinner"
import {Newspaper, ExternalLink, RefreshCw, Clock, ImageOff, Search, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useQueryClient} from "@tanstack/react-query"
import {useState, useEffect, useRef, useCallback} from "react"
import type {NewsItem} from "@/app/api/news/types"

export default function NewsPage() {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const {data, isLoading, dataUpdatedAt, fetchNextPage, hasNextPage, isFetchingNextPage} = useGetNews(debouncedSearch || undefined)
    const queryClient = useQueryClient()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(timer)
    }, [search])

    // Intersection Observer for infinite scroll
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    )

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(handleObserver, {rootMargin: "200px"})
        observer.observe(el)
        return () => observer.disconnect()
    }, [handleObserver])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await queryClient.invalidateQueries({queryKey: ["news"]})
        setIsRefreshing(false)
    }

    const updatedAtLabel = dataUpdatedAt
        ? new Date(dataUpdatedAt).toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"})
        : null

    const allNews = data?.pages.flatMap((p) => p.data) ?? []
    const total = data?.pages[0]?.meta.total ?? 0

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                        <Newspaper className="size-6"/>
                        Новости
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Экономические и финансовые новости
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {updatedAtLabel && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3"/>
                            Обновлено в {updatedAtLabel}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="cursor-pointer"
                    >
                        <RefreshCw className={`size-4 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}/>
                        Обновить
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по новостям..."
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {!isLoading && debouncedSearch && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {total} результатов
                    </span>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner/>
                </div>
            ) : allNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Newspaper className="size-10 mb-3 opacity-30"/>
                    <p className="text-sm">{debouncedSearch ? "Ничего не найдено" : "Нет новостей"}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {allNews.map((item, i) => (
                        <NewsCard key={`${item.url}-${i}`} item={item}/>
                    ))}

                    {/* Sentinel for infinite scroll */}
                    <div ref={sentinelRef} className="h-1"/>

                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="size-5 animate-spin text-muted-foreground"/>
                        </div>
                    )}

                    {!hasNextPage && allNews.length > 0 && (
                        <p className="text-center text-xs text-muted-foreground py-4">
                            Все новости загружены
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

function NewsCard({item}: {item: NewsItem}) {
    const [imgError, setImgError] = useState(false)

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors"
        >
            {/* Image */}
            {item.image && !imgError ? (
                <div className="shrink-0 w-[140px] h-[90px] rounded-lg overflow-hidden bg-muted">
                    <img
                        src={item.image}
                        alt=""
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : item.image ? (
                <div className="shrink-0 w-[140px] h-[90px] rounded-lg bg-muted flex items-center justify-center">
                    <ImageOff className="size-5 text-muted-foreground/40"/>
                </div>
            ) : null}

            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h2 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                    </h2>
                    {item.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                            {item.description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{item.publishedAt}</span>
                    {item.category && (
                        <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                            {item.category}
                        </span>
                    )}
                    <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto"/>
                </div>
            </div>
        </a>
    )
}
