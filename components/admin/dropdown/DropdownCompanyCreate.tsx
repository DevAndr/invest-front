"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {DialogCompanyCreate} from "@/components/admin/dialog/DialogCompanyCreate";

export const DropdownCompanyCreate = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const router = useRouter()

    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><Plus className="size-4"/>Добавить</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                        Добавить
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/admin/import")}>
                        Добавить несколько
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <DialogCompanyCreate open={dialogOpen} onOpenChange={setDialogOpen}/>
    </>
}
