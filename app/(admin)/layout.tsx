import React, {ReactNode} from "react";
import {AdminSidebar} from "@/components/admin/admin-sidebar";
import {Toaster} from "@/components/ui/sonner";

interface Props {
    children: ReactNode
}


export default function AdminLayout({children}: Props) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 border-b border-border flex items-center px-6">
                    {/* <Appbar/> */}
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                    <Toaster/>
                </main>
            </div>
        </div>
    )
}