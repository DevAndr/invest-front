"use client"

import {useState} from "react"
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
                    <DropdownMenuItem>
                        Добавить несколько
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <DialogCompanyCreate open={dialogOpen} onOpenChange={setDialogOpen}/>
    </>
}
