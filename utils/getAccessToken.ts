export function saveToken(token: string): void {
    window.localStorage.setItem("accessToken", token);
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem("accessToken");
}

export function clearToken(): void {
    window.localStorage.removeItem("accessToken");
}