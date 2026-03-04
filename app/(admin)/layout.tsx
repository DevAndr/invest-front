import React, {ReactNode} from "react";
import {AdminSidebar} from "@/components/admin/admin-sidebar";

interface Props {
    children: ReactNode
}

export default function Layout({children}: Props) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 border-b border-border flex items-center px-6">
                    {/* <Appbar/> */}
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}