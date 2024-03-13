export interface UseSessionOptions<R extends boolean> {
    required: R
    onUnauthenticated?: () => void
}

export interface AuthClientConfig {
    isInitialLoaded: boolean
    user: User | null,
    access_token: string | null,
    refresh_token: string | null,
    getSessionFromStorage: (...args: any[]) => any
}
export interface Session {
    user: User | null,
    access_token: string | null,
    refresh_token: string | null,
}
export interface BroadcastMessage {
    event?: "session"
    data?: { trigger?: "signout" | "getSession" }
    clientId: string
    timestamp: number
}
export interface User {
    _id: string
    name?: string | null
    email?: string | null
}
export interface SessionProviderProps {
    children: React.ReactNode
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
    refetchWhenOffline?: false
    handleLoaded?: any,
    getLayout?: any,
    Component?: any,
    pageProps?: any
}