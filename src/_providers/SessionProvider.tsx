"use client";
import React, { useRef } from "react"
import { AuthClientConfig, BroadcastMessage, Session, SessionProviderProps, UseSessionOptions, User } from "../_types/auth"

export function BroadcastChannel(name = "renec.auth.message") {
  return {
    /** Get notified by other tabs/windows. */
    receive(onReceive: (message: BroadcastMessage) => void) {
      const handler = (event: StorageEvent) => {
        if (event.key !== name) return
        const message: BroadcastMessage = JSON.parse(event.newValue ?? "{}")
        if (message?.event !== "session" || !message?.data) return

        onReceive(message)
      }
      window.addEventListener("storage", handler)
      return () => window.removeEventListener("storage", handler)
    },
    post(message: Record<string, unknown>) {
      if (typeof window === "undefined") return
      try {
        localStorage.setItem(
          name,
          JSON.stringify({ ...message, timestamp: now() })
        )
      } catch {
      }
    },
  }
}

const broadcast = BroadcastChannel()

export const RENECAUTH: AuthClientConfig = {
  isInitialLoaded: false,
  user: null,
  access_token: null,
  refresh_token: null,
  getSessionFromStorage: () => { },
}

export function now() {
  return Math.floor(Date.now() / 1000)
}

export type SessionContextValue<R extends boolean = false> = R extends true
  ?
  | { access_token: string; refresh_token: string; user: User; status: "authenticated" }
  | { access_token: null; refresh_token: null; user: null; status: "loading" }
  :
  | { access_token: string; refresh_token: string; user: User; status: "authenticated" }
  | { access_token: null; refresh_token: null; user: null; status: "unauthenticated" | "loading" }

export const SessionContext = React.createContext?.<
  SessionContextValue | undefined
>(undefined)

export async function setSessionsToStorage(session: Session) {
  await localStorage.setItem("renec.auth", JSON.stringify(session))
}
export async function getSessionFromStorage() {
  const auth = await localStorage.getItem("renec.auth")
  const data = {
    user: null,
    access_token: null,
    refresh_token: null
  }
  if (auth) {
    try {
      const authObj = JSON.parse(auth)
      data.user = authObj.user ?? null;
      data.access_token = authObj.access_token ?? null;
      data.refresh_token = authObj.refresh_token ?? null;
    } catch (error) { }
  }
  return data;
}

export async function initialLoad() {
  RENECAUTH.isInitialLoaded = true
  broadcast.post({ event: "session", data: { trigger: "initialLoad" } })
}
export function SessionProvider(props: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components")
  }
  const { children } = props
  const [user, setUser] = React.useState<User | null>(null)
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const dataFetchedRef = useRef(false);

  React.useEffect(() => {
    RENECAUTH.getSessionFromStorage = async ({ event } = {}) => {
      try {
        const sessionsFromStorage = await getSessionFromStorage();
        RENECAUTH.user = sessionsFromStorage.user ?? null;
        RENECAUTH.access_token = sessionsFromStorage.access_token ?? null;
        RENECAUTH.refresh_token = sessionsFromStorage.refresh_token ?? null;
        setUser(RENECAUTH.user)
        setAccessToken(RENECAUTH.access_token)
        setRefreshToken(RENECAUTH.refresh_token)
        return
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    RENECAUTH.getSessionFromStorage({ event: 'reload'})

    if (!dataFetchedRef.current && !RENECAUTH.isInitialLoaded) {
      dataFetchedRef.current = true;
      initialLoad();
    }
    const unsubscribe = broadcast.receive(() =>
      RENECAUTH.getSessionFromStorage({ event: 'broadcast' })
    )
    return () => {
      unsubscribe()
      RENECAUTH.user = null
      RENECAUTH.access_token = null
      RENECAUTH.refresh_token = null
      RENECAUTH.getSessionFromStorage = () => { }
    }
  }, [])

  React.useEffect(() => {
    const { refetchOnWindowFocus = true } = props
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session, but only if
    // this feature is not disabled.
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible")
        RENECAUTH.getSessionFromStorage({ event: 'reload' })
    }
    document.addEventListener("visibilitychange", visibilityHandler, false)
    return () =>
      document.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [props.refetchOnWindowFocus])

  const value: any = React.useMemo(
    () => ({
      user: user,
      access_token: accessToken,
      refresh_token: refreshToken,
      status: loading
        ? "loading"
        : user !== null
          ? "authenticated"
          : "unauthenticated",
    }),
    [user, accessToken, refreshToken]
  )
  return ((!loading) ? <SessionContext.Provider value={value}>
    {children}
  </SessionContext.Provider> : null)
}

export async function signOut() {
  await localStorage.removeItem("renec.auth");
  broadcast.post({ event: "session", data: { trigger: "signout" } })
  await RENECAUTH.getSessionFromStorage({ event: "storage" })
}

export async function signIn(session: Session) {
  await setSessionsToStorage(session)
  broadcast.post({ event: "session", data: { trigger: "signin" } })
  await RENECAUTH.getSessionFromStorage({ event: "storage" })
}

export function useSession<R extends boolean>(options?: UseSessionOptions<R>) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components")
  }
  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue<R> = React.useContext(SessionContext)
  if (!value && process.env.NODE_ENV !== "production") {
    throw new Error(
      "[auth]: `useSession` must be wrapped in a <SessionProvider />"
    )
  }

  return value
}
