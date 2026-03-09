"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    FileText,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Upload,
} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {useState} from "react"

const navItems = [
    {label: "Дашборд", href: "/admin", icon: LayoutDashboard},
    {label: "Компании", href: "/admin/companies", icon: Building2},
    {label: "Импорт", href: "/admin/import", icon: Upload},
    {label: "Пользователи", href: "/admin/users", icon: Users},
    {label: "Отчёты", href: "/admin/reports", icon: FileText},
    {label: "Аналитика", href: "/admin/analytics", icon: BarChart3},
    {label: "Настройки", href: "/admin/settings", icon: Settings},
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "flex flex-col h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className={cn(
                "flex items-center h-14 border-b border-sidebar-border px-4",
                collapsed ? "justify-center" : "justify-between"
            )}>
                {!collapsed && (
                    <span className="text-lg font-semibold tracking-tight">Админ</span>
                )}
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                    {collapsed ? <ChevronRight className="size-4"/> : <ChevronLeft className="size-4"/>}
                </Button>
            </div>

            <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/70",
                                collapsed && "justify-center px-0"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="size-5 shrink-0"/>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
