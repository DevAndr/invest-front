import {axiosInstance} from "@/app/api/axios/axiosInstance";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {AuthResponse, LoginRequest} from "@/app/api/auth/types";

const login = async (req: LoginRequest) => {
    const resp = await axiosInstance.post<AuthResponse>("/auth/login", req)
    return resp.data
}

export const useLogin = () => {
    return useMutation<AuthResponse, AxiosError, LoginRequest>({
        mutationFn: login
    })
}
