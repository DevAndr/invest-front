import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {NotesResponse} from "@/app/api/notes/types"
import {useQuery} from "@tanstack/react-query"

const getNotes = async (companyId: string) => {
    const resp = await axiosInstance.get<NotesResponse>(`/companies/${companyId}/notes`)
    return resp.data
}

export const useGetNotes = (companyId: string | null) => {
    return useQuery({
        queryKey: ["notes", companyId],
        queryFn: () => getNotes(companyId!),
        enabled: !!companyId,
    })
}
