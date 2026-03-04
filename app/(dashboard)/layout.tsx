'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React, {ReactNode} from "react";

type DashboardProps = {
    children: ReactNode
}

const queryClient = new QueryClient()

export default function DashboardLayout({children}: DashboardProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <header>
                {/* <Appbar/> */}
            </header>
            <main className='m-6'>
                {children}
            </main>
            <footer>

            </footer>
        </QueryClientProvider>
    )
}