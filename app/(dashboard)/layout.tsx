import React, {ReactNode} from "react";
import {SplashScreen} from "@/components/SplashScreen";
import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";

type DashboardProps = {
    children: ReactNode
}

export default function DashboardLayout({children}: DashboardProps) {
    return (
        <SplashScreen>
            <TooltipProvider>
                <header>
                    {/* <Appbar/> */}
                </header>
                <main className='m-6'>

                    {children}

                    <Toaster/>
                </main>
                <footer>

                </footer>
            </TooltipProvider>
        </SplashScreen>
    )
}