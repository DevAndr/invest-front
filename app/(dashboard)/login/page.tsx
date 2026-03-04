"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {Eye, EyeOff, LogIn} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useLogin} from "@/app/api/auth/useLogin"

export default function LoginPage() {
    const router = useRouter()
    const {mutate: login, isPending, error} = useLogin()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login({email, password}, {
            onSuccess: (data) => {
                localStorage.setItem("accessToken", data.accessToken)
                router.push("/companies")
            },
        })
    }

    return (
        <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Вход</CardTitle>
                    <CardDescription>Войдите в свой аккаунт</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="mail@example.com"
                                required
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Введите пароль"
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-destructive text-center">
                                Неверный email или пароль
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                                    Вход...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="size-4"/>
                                    Войти
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
                            Зарегистрироваться
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
