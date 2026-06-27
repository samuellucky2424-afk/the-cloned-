import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  EmailAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile as updateFirebaseProfile,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured, requireFirebaseServices } from '../lib/firebase'
import {
  createCustomerProfile,
  createAdminProfile,
  getUserProfile,
  isBootstrapAdminEmail,
  recordLogin,
  updateUserProfile,
  getEmailByAccountNumber,
  type RegistrationData,
  type UserProfile,
} from '../lib/banking'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  configured: boolean
  signIn: (identifier: string, password: string, rememberMe: boolean) => Promise<UserProfile>
  register: (
    data: RegistrationData & { password: string },
    onStatus?: (status: string) => void
  ) => Promise<UserProfile>
  logout: () => Promise<void>
  refreshProfile: () => Promise<UserProfile | null>
  updateCurrentProfile: (data: Partial<UserProfile>) => Promise<void>
  updateAvatar: (photoURL: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs)
  })

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeout,
  ])
}

function authErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Something went wrong. Please try again.'

  if ('code' in error) {
    const code = String(error.code)
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'The email or password is incorrect.'
      case 'auth/email-already-in-use':
        return 'An account already exists for this email address.'
      case 'auth/weak-password':
        return 'Please choose a stronger password.'
      case 'auth/configuration-not-found':
        return 'Firebase Authentication is not enabled for this project yet. In Firebase Console, open Authentication, click Get started, then enable Email/Password sign-in.'
      case 'auth/requires-recent-login':
        return 'Please log out and sign in again before changing your password.'
      case 'permission-denied':
        return 'Firestore blocked the account profile save. Create the Firestore database and publish rules that allow authenticated users to create their own profile, accounts, and transactions.'
      case 'failed-precondition':
      case 'not-found':
        return 'Firebase Auth created the login, but Firestore is not ready. In Firebase Console, create the Firestore Database for this project, then try again.'
      case 'unavailable':
      case 'deadline-exceeded':
        return 'Firestore is taking too long to answer. Check the internet connection and that the Firestore database is enabled for this Firebase project.'
      default:
        return error.message
    }
  }

  return error.message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!auth?.currentUser) {
      setProfile(null)
      return null
    }

    const loadedProfile = await getUserProfile(auth.currentUser.uid)
    setProfile(loadedProfile)
    return loadedProfile
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setUser(firebaseUser)

      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const loadedProfile = await getUserProfile(firebaseUser.uid)
        setProfile(loadedProfile)
      } catch (error) {
        console.error('Failed to load user profile', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    configured: isFirebaseConfigured,
    signIn: async (identifier, password, rememberMe) => {
      try {
        const { auth } = requireFirebaseServices()
        let signInEmail = identifier.trim()

        if (/^\d{8}$/.test(signInEmail)) {
          const resolvedEmail = await getEmailByAccountNumber(signInEmail)
          if (!resolvedEmail) {
            throw new Error('No banking profile was found for this account number.')
          }
          signInEmail = resolvedEmail
        }
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
        let credential

        try {
          credential = await signInWithEmailAndPassword(auth, signInEmail, password)
        } catch (signInError) {
          const code = signInError instanceof Error && 'code' in signInError
            ? String(signInError.code)
            : ''

          const canBootstrapAdmin = isBootstrapAdminEmail(signInEmail)
            && (code === 'auth/user-not-found' || code === 'auth/invalid-credential')

          if (!canBootstrapAdmin) {
            throw signInError
          }

          try {
            credential = await createUserWithEmailAndPassword(auth, signInEmail, password)
          } catch (createError) {
            const createCode = createError instanceof Error && 'code' in createError
              ? String(createError.code)
              : ''

            if (createCode === 'auth/email-already-in-use') {
              throw signInError
            }

            throw createError
          }
          await updateFirebaseProfile(credential.user, { displayName: 'Harry Eriksen' })
        }

        let loadedProfile = await getUserProfile(credential.user.uid)

        if (!loadedProfile && isBootstrapAdminEmail(credential.user.email ?? signInEmail)) {
          loadedProfile = await createAdminProfile(credential.user.uid, credential.user.email ?? signInEmail)
        }

        if (!loadedProfile) {
          throw new Error('This login exists, but no banking profile was found.')
        }

        await recordLogin(credential.user.uid)
        setUser(credential.user)
        setProfile(loadedProfile)
        return loadedProfile
      } catch (error) {
        throw new Error(authErrorMessage(error))
      }
    },
    register: async (data, onStatus) => {
      try {
        const { auth } = requireFirebaseServices()
        onStatus?.('Creating secure login...')
        const credential = await createUserWithEmailAndPassword(auth, data.email, data.password)
        const displayName = `${data.firstName} ${data.lastName}`.trim()

        if (displayName) {
          onStatus?.('Saving your display name...')
          await updateFirebaseProfile(credential.user, { displayName })
        }

        onStatus?.('Creating banking profile and accounts...')
        const profile = await withTimeout(
          createCustomerProfile(credential.user.uid, data),
          25000,
          'Firebase created the login, but Firestore did not finish saving the banking profile. Make sure Firestore Database is created for this project and its rules allow authenticated writes.'
        )
        onStatus?.('Account ready. Opening dashboard...')
        setUser(credential.user)
        setProfile(profile)
        return profile
      } catch (error) {
        throw new Error(authErrorMessage(error))
      }
    },
    logout: async () => {
      const { auth } = requireFirebaseServices()
      await signOut(auth)
      setUser(null)
      setProfile(null)
    },
    refreshProfile,
    updateCurrentProfile: async (data) => {
      if (!user) throw new Error('You must be signed in to update your profile.')
      await updateUserProfile(user.uid, data)
      setProfile((current) => current ? { ...current, ...data } : current)
    },
    updateAvatar: async (photoURL: string) => {
      const { auth } = requireFirebaseServices()
      if (!auth.currentUser) throw new Error('You must be signed in to update your profile picture.')
      await updateFirebaseProfile(auth.currentUser, { photoURL })
      const clonedUser = Object.create(Object.getPrototypeOf(auth.currentUser))
      Object.assign(clonedUser, auth.currentUser)
      setUser(clonedUser)
    },
    changePassword: async (currentPassword, newPassword) => {
      const { auth } = requireFirebaseServices()
      const currentUser = auth.currentUser

      if (!currentUser?.email) {
        throw new Error('You must be signed in to change your password.')
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)
    },
  }), [loading, profile, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
