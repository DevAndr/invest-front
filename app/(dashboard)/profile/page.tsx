"use client"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {ArrowLeft, Check, Eye, EyeOff, KeyRound, LogOut, Save, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useUser, useUserStore} from "@/stores/userStore"
import {useUpdateProfile} from "@/app/api/auth/useUpdateProfile"
import {useChangePassword} from "@/app/api/auth/useChangePassword"
import {toast} from "sonner"
import {useFavoritesStore} from "@/stores/favoritesStore"

const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

export default function ProfilePage() {
    const router = useRouter()
    const user = useUser()
    const setUser = useUserStore((s) => s.setUser)
    const clearAuth = useUserStore((s) => s.clear)

    // Profile form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    // Password form
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)

    // Stats
    const favoriteCount = useFavoritesStore((s) => s.ids.length)

    const {mutate: updateProfile, isPending: isUpdating} = useUpdateProfile()
    const {mutate: changePassword, isPending: isChanging} = useChangePassword()

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
        }
    }, [user])

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault()
        updateProfile(
            {name, email},
            {
                onSuccess: (updated) => {
                    setUser(updated)
                    toast.success("Профиль обновлён")
                },
                onError: () => {
                    toast.error("Не удалось обновить профиль")
                },
            }
        )
    }

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("Пароли не совпадают")
            return
        }
        if (newPassword.length < 6) {
            toast.error("Пароль должен быть не менее 6 символов")
            return
        }
        changePassword(
            {currentPassword, newPassword},
            {
                onSuccess: () => {
                    toast.success("Пароль изменён")
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    router.replace('/login')
                },
                onError: () => {
                    toast.error("Не удалось изменить пароль. Проверьте текущий пароль.")
                },
            }
        )
    }

    const handleLogout = () => {
        clearAuth()
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        router.push("/login")
    }

    if (!user) return null

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/companies"
                    className="inline-flex items-center justify-center size-8 rounded-md border border-border hover:bg-muted transition-colors"
                >
                    <ArrowLeft className="size-4"/>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Профиль</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">Управление аккаунтом и настройками</p>
                </div>
            </div>

            {/* User info card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary text-xl font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-border p-3 space-y-1">
                            <p className="text-xs text-muted-foreground">Избранных компаний</p>
                            <p className="text-lg font-semibold tabular-nums">{favoriteCount}</p>
                        </div>
                        <div className="rounded-lg border border-border p-3 space-y-1">
                            <p className="text-xs text-muted-foreground">ID аккаунта</p>
                            <p className="text-xs font-mono text-muted-foreground truncate">{user.id}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit profile */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground"/>
                        <CardTitle className="text-base">Личные данные</CardTitle>
                    </div>
                    <CardDescription>Обновите имя или email</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Имя</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="profile-email" className="text-sm font-medium">Email</label>
                            <input
                                id="profile-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <Button type="submit" className='cursor-pointer' disabled={isUpdating}>
                            {isUpdating ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                                    Сохранение...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="size-4"/>
                                    Сохранить
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change password */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <KeyRound className="size-4 text-muted-foreground"/>
                        <CardTitle className="text-base">Смена пароля</CardTitle>
                    </div>
                    <CardDescription>Введите текущий и новый пароль</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="current-password" className="text-sm font-medium">Текущий пароль</label>
                            <div className="relative">
                                <input
                                    id="current-password"
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    placeholder="Введите текущий пароль"
                                    className={inputClass + " pr-10"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrent ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="text-sm font-medium">Новый пароль</label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Минимум 6 символов"
                                    className={inputClass + " pr-10"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNew ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="text-sm font-medium">Подтвердите пароль</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Повторите новый пароль"
                                className={inputClass}
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-destructive">Пароли не совпадают</p>
                            )}
                            {confirmPassword && newPassword === confirmPassword && (
                                <p className="text-xs text-emerald-500 flex items-center gap-1">
                                    <Check className="size-3"/> Пароли совпадают
                                </p>
                            )}
                        </div>
                        <Button type="submit" className='cursor-pointer' disabled={isChanging}>
                            {isChanging ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                                    Смена пароля...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <KeyRound className="size-4"/>
                                    Сменить пароль
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Logout */}
            <Card className="border-destructive/30">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Выйти из аккаунта</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Вы будете перенаправлены на страницу входа</p>
                        </div>
                        <Button variant="destructive" size="sm" className='cursor-pointer' onClick={handleLogout}>
                            <LogOut className="size-4 mr-1.5"/>
                            Выйти
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
