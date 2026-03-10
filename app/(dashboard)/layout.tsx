import React, {ReactNode} from "react";
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
                <header className="flex items-center justify-end px-6 py-3">
                    <ThemeToggle/>
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