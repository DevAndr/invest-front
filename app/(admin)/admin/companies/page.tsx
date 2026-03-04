import Link from "next/link"
import {Plus, Search, MoreHorizontal, ArrowUpDown, Building2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {MenuBarCompanies} from "@/components/admin/menuBar/MenuBarCompanies";
import {DropdownCompanyCreate} from "@/components/admin/dropdown/DropdownCompanyCreate";

const companies = [
    {id: 1, name: "Газпром", ticker: "GAZP", sector: "Энергетика", price: "168.42 ₽", change: "+1.2%", up: true},
    {id: 2, name: "Сбербанк", ticker: "SBER", sector: "Финансы", price: "307.15 ₽", change: "+0.8%", up: true},
    {id: 3, name: "Лукойл", ticker: "LKOH", sector: "Энергетика", price: "7 245.00 ₽", change: "-0.3%", up: false},
    {id: 4, name: "Яндекс", ticker: "YDEX", sector: "Технологии", price: "4 120.50 ₽", change: "+2.1%", up: true},
    {id: 5, name: "Роснефть", ticker: "ROSN", sector: "Энергетика", price: "581.30 ₽", change: "-0.5%", up: false},
    {id: 6, name: "Норникель", ticker: "GMKN", sector: "Металлы", price: "156.80 ₽", change: "+0.4%", up: true},
    {id: 7, name: "Магнит", ticker: "MGNT", sector: "Ритейл", price: "5 890.00 ₽", change: "-1.1%", up: false},
    {id: 8, name: "Т-Банк", ticker: "TCSG", sector: "Финансы", price: "2 780.00 ₽", change: "+1.5%", up: true},
]

export default function CompaniesPage() {

    console.log(process.env.NEXT_PUBLIC_API)

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
                        <th className="text-right font-medium text-muted-foreground px-4 py-3">
                                <span
                                    className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground">
                                    Цена <ArrowUpDown className="size-3"/>
                                </span>
                        </th>
                        <th className="text-right font-medium text-muted-foreground px-4 py-3">Изменение</th>
                        <th className="w-10 px-4 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((company) => (
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
                                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{company.ticker}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{company.sector}</td>
                            <td className="px-4 py-3 text-right font-mono">{company.price}</td>
                            <td className={`px-4 py-3 text-right font-mono text-xs font-medium ${company.up ? "text-emerald-500" : "text-red-500"}`}>
                                {company.change}
                            </td>
                            <td className="px-4 py-3">
                                <Button variant="ghost" size="icon-xs">
                                    <MoreHorizontal className="size-4"/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Показано {companies.length} из {companies.length} компаний</span>
            </div>
        </div>
    )
}
