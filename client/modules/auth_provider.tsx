import { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

export type UserInfo = {
  username: string
  id: string
}

export const AuthContext = createContext<{
  authenticated: boolean
  setAuthenticated: (auth: boolean) => void
  user: UserInfo
  setUser: (user: UserInfo) => void
}>({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: '', id: '' },
  setUser: () => {},
})

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<UserInfo>({ username: '', id: '' })

  const router = useRouter()

  useEffect(() => {
    if (!authenticated) {
      if (window.location.pathname !== '/signup') {
        router.push('/login')
      }
    }
  }, [authenticated])

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
