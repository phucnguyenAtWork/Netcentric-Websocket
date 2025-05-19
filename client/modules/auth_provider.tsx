import { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { API_URL } from '../constants'

export type UserInfo = {
  username: string
  id: string
}

export const AuthContext = createContext<{
  authenticated: boolean
  setAuthenticated: (auth: boolean) => void
  user: UserInfo
  setUser: (user: UserInfo) => void
  logout: () => Promise<void>
}>({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: '', id: '' },
  setUser: () => {},
  logout: async () => {},
})

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<UserInfo>({ username: '', id: '' })

  const router = useRouter()

  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')

    if (!userInfo) {
      if (window.location.pathname != '/signup') {
        router.push('/login')
        return
      }
    } else {
      const user: UserInfo = JSON.parse(userInfo)
      if (user) {
        setUser({
          username: user.username,
          id: user.id,
        })
      }
      setAuthenticated(true)
    }
  }, [authenticated])

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
      })

      if (res.ok) {
        localStorage.removeItem('user_info')
        setUser({ username: '', id: '' })
        setAuthenticated(false)
        router.push('/login')
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        user: user,
        setUser: setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider