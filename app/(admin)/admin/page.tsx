import {Building2, Users, FileText, BarChart3, TrendingUp, TrendingDown} from "lucide-react"

const stats = [
    {label: "Компании", value: "128", icon: Building2, change: "+12", up: true},
    {label: "Пользователи", value: "1 024", icon: Users, change: "+48", up: true},
    {label: "Отчёты", value: "56", icon: FileText, change: "+3", up: true},
    {label: "Аналитика", value: "89%", icon: BarChart3, change: "-2%", up: false},
]

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>
                <p className="text-muted-foreground text-sm mt-1">Обзор основных показателей</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-border bg-card p-5 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                            <stat.icon className="size-4 text-muted-foreground"/>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-500" : "text-red-500"}`}>
                                {stat.up ? <TrendingUp className="size-3"/> : <TrendingDown className="size-3"/>}
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <h2 className="text-sm font-medium text-muted-foreground">Последние действия</h2>
                    <div className="space-y-3">
                        {[
                            {text: "Добавлена компания «Газпром»", time: "5 мин назад"},
                            {text: "Обновлён отчёт Q4 2025", time: "12 мин назад"},
                            {text: "Новый пользователь зарегистрирован", time: "1 ч назад"},
                            {text: "Изменены настройки аналитики", time: "3 ч назад"},
                        ].map((item) => (
                            <div key={item.text} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <span className="text-sm">{item.text}</span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <h2 className="text-sm font-medium text-muted-foreground">Быстрые действия</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {label: "Добавить компанию", icon: Building2, href: "/admin/companies"},
                            {label: "Пользователи", icon: Users, href: "/admin/users"},
                            {label: "Создать отчёт", icon: FileText, href: "/admin/reports"},
                            {label: "Аналитика", icon: BarChart3, href: "/admin/analytics"},
                        ].map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-sm hover:bg-accent transition-colors"
                            >
                                <action.icon className="size-5 text-muted-foreground"/>
                                <span>{action.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
