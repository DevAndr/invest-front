"use client"

import {useEffect} from "react"
import {useRouter, usePathname} from "next/navigation"
import {useGetMe} from "@/app/api/auth/useGetMe"
import {Spinner} from "@/components/ui/spinner";
import {useUserStore} from "@/stores/userStore";
import {getToken} from "@/utils/getAccessToken";

const PUBLIC_PATHS = ["/login", "/register"]

interface SplashScreenProps {
    children: React.ReactNode
}

export function SplashScreen({children}: SplashScreenProps) {
    const router = useRouter()
    const pathname = usePathname()
    const isPublicPage = PUBLIC_PATHS.includes(pathname)

    const token = getToken()
    const setUser = useUserStore(s => s.setUser)
    const {data: user, isLoading, isError} = useGetMe(!!token && !isPublicPage)

    useEffect(() => {
        if (user) {
            setUser(user)
        }
    }, [user, setUser])

    useEffect(() => {
        if (isPublicPage) return

        if (!token) {
            router.replace("/login")
            return
        }

        if (isError) {
            router.replace("/login")
        }
    }, [token, isError, isPublicPage, router])

    if (isPublicPage) {
        return <>{children}</>
    }

    if (isLoading || (!user && !isError)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">Загрузка...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
