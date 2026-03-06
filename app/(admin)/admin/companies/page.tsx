"use client"

import Link from "next/link"
import {useState} from "react"
import {Search, MoreHorizontal, ArrowUpDown, Building2, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {MenuBarCompanies} from "@/components/admin/menuBar/MenuBarCompanies"
import {DropdownCompanyCreate} from "@/components/admin/dropdown/DropdownCompanyCreate"
import {useGetCompanies} from "@/app/api/companies/useGetCompanies"
import {Spinner} from "@/components/ui/spinner";

export default function CompaniesPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const {data, isLoading} = useGetCompanies({page, limit: 20, search})

    const companies = data?.data ?? []
    const meta = data?.meta

    return (
        <div className="space-y-6">
            <MenuBarCompanies/>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Компании</h1>
                    <p className="text-muted-foreground text-sm mt-1">Управление списком компаний</p>
                </div>
                <DropdownCompanyCreate/>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder="Поиск по названию или тикеру..."
                        className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">
                            <span className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                Название <ArrowUpDown className="size-3"/>
                            </span>
                        </th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Тикер</th>
                        <th className="text-left font-medium text-muted-foreground px-4 py-3">Сектор</th>
                        <th className="w-10 px-4 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                <Spinner/>
                                Загрузка...
                            </td>
                        </tr>
                    ) : companies.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                Компании не найдены
                            </td>
                        </tr>
                    ) : (
                        companies.map((company) => (
                            <tr key={company.id}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <Link href={`/admin/companies/${company.id}`}
                                          className="flex items-center gap-3 hover:underline">
                                        <div className="flex items-center justify-center size-8 rounded-lg bg-muted">
                                            <Building2 className="size-4 text-muted-foreground"/>
                                        </div>
                                        <span className="font-medium">{company.name}</span>
                                    </Link>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{company.ticker}</span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{company.industry}</td>
                                <td className="px-4 py-3">
                                    <Button variant="ghost" size="icon-xs">
                                        <MoreHorizontal className="size-4"/>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {meta && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Показано {companies.length} из {meta.total} компаний</span>
                    {meta.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}>
                                Назад
                            </Button>
                            <span>Стр. {page} из {meta.totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= meta.totalPages}
                                    onClick={() => setPage(p => p + 1)}>
                                Вперёд
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
