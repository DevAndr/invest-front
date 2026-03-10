import React, {ReactNode} from "react";
import Link from "next/link";
import {Newspaper, UserCircle} from "lucide-react";
import {SplashScreen} from "@/components/SplashScreen";
import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeToggle} from "@/components/ui/theme-toggle";

type DashboardProps = {
    children: ReactNode
}

export default function DashboardLayout({children}: DashboardProps) {
    return (
        <SplashScreen>
            <TooltipProvider>
                <header className="flex items-center justify-end gap-2 px-6 py-3">
                    <Link
                        href="/news"
                        className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Новости"
                    >
                        <Newspaper className="size-4"/>
                    </Link>
                    <ThemeToggle/>
                    <Link
                        href="/profile"
                        className="inline-flex items-center justify-center size-8 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Профиль"
                    >
                        <UserCircle className="size-4"/>
                    </Link>
                </header>
                <main className='mx-6 mb-6'>

                    {children}

                    <Toaster/>
                </main>
                <footer>

                </footer>
            </TooltipProvider>
        </SplashScreen>
    )
}