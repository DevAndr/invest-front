import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useQuery} from "@tanstack/react-query"
import {AuthUser} from "@/app/api/auth/types"

const getMe = async () => {
    const resp = await axiosInstance.get<AuthUser>("/auth/me")
    return resp.data
}

export const useGetMe = (enabled = true) => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        enabled,
        retry: false,
    })
}
