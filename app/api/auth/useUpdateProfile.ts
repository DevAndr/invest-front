import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {AuthUser} from "@/app/api/auth/types"

export interface UpdateProfileRequest {
    name: string
    email: string
}

const updateProfile = async (req: UpdateProfileRequest) => {
    const resp = await axiosInstance.patch<AuthUser>("/auth/profile", req)
    return resp.data
}

export const useUpdateProfile = () => {
    return useMutation<AuthUser, AxiosError, UpdateProfileRequest>({
        mutationFn: updateProfile,
    })
}
