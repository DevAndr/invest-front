import {AuthUser} from "@/app/api/auth/types";

export interface Note {
    id: string
    companyId: string
    userId: string
    content: string
    createdAt: string
    updatedAt: string
    user: AuthUser
}

export type NotesResponse = Note[]
