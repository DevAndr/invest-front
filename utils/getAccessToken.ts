export function saveToken(token: string): void {
    localStorage.setItem("accessToken", token);
}

export function getToken(): string | null {
    return localStorage.getItem("accessToken");
}

export function clearToken(): void {
    localStorage.removeItem("accessToken");
}