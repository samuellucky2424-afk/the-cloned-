import {
  collection,
  doc,
  getDocs,
  getDoc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db, requireFirebaseServices } from './firebase'

export type UserRole = 'customer' | 'admin'
export type UserStatus = 'Active' | 'Suspended' | 'Pending'
export type TransferType = 'domestic' | 'international' | 'bills'

export interface NotificationPreferences {
  emailAlerts: boolean
  smsAlerts: boolean
  transactionEmails: boolean
  marketingEmails: boolean
  loginAlerts: boolean
}

export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  ssn: string
  address: string
  country: string
  gender: string
  occupation: string
  monthlySalary: string
  sourceOfIncome: string
  role: UserRole
  status: UserStatus
  balance: number
  notificationPreferences: NotificationPreferences
  createdAt?: unknown
  updatedAt?: unknown
  lastLoginAt?: unknown
}

export interface BankAccount {
  id: string
  userId: string
  type: 'current' | 'savings' | 'isa'
  label: string
  accountNumber?: string
  balance: number
  currency: string
  isPrimary: boolean
  createdAt?: unknown
  updatedAt?: unknown
}

export interface Transaction {
  id: string
  userId: string
  userName: string
  type: 'Deposit' | 'Transfer' | 'International Transfer' | 'Bill Payment'
  transferType?: TransferType
  title: string
  amount: number
  fee: number
  total: number
  currency: string
  status: 'Completed' | 'Pending' | 'Blocked' | 'Declined'
  fromAccountId?: string
  fromAccountLabel?: string
  senderName?: string
  recipientName?: string
  recipientAccount?: string
  recipientAddress?: string
  recipientCountry?: string
  recipientPhone?: string
  sortCode?: string
  bankName?: string
  reference?: string
  billType?: string
  billAccount?: string
  createdAt?: unknown
  updatedAt?: unknown
  approvedAt?: unknown
  declinedAt?: unknown
}

export interface RegistrationData {
  firstName: string
  lastName: string
  phone: string
  email: string
  ssn: string
  address: string
  country: string
  gender: string
  occupation: string
  monthlySalary: string
  sourceOfIncome: string
}

export interface TransferPayload {
  transferType: TransferType
  fromAccountId: string
  recipientName: string
  recipientAccount: string
  recipientAddress?: string
  recipientCountry?: string
  recipientPhone?: string
  sortCode: string
  bankName: string
  amount: number
  currency: string
  reference: string
  billType?: string
  billAccount?: string
}

export const defaultNotifications: NotificationPreferences = {
  emailAlerts: true,
  smsAlerts: true,
  transactionEmails: true,
  marketingEmails: false,
  loginAlerts: true,
}

const defaultAccountBalances = {
  current: 0,
  savings: 0,
  isa: 0,
}

const bootstrapAdminEmails = ['harryeriksen520@gmail.com']

export function isBootstrapAdminEmail(email?: string | null) {
  return Boolean(email && bootstrapAdminEmails.includes(email.trim().toLowerCase()))
}

function mapDoc<T>(snapshot: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snapshot.id, ...snapshot.data() } as T
}

function timestampToMillis(value: unknown) {
  if (!value) return 0
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'string') return new Date(value).getTime()
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().getTime()
  }
  return 0
}

function sortNewestFirst<T extends { createdAt?: unknown }>(items: T[]) {
  return [...items].sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt))
}

function accountNumberFor(uid: string, suffix: string) {
  const input = `${uid}_${suffix}`
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 90000000
  }
  return String(hash + 10000000).padStart(8, '0')
}

export function formatCurrency(amount: number, _currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDateTime(value: unknown) {
  const millis = timestampToMillis(value)
  if (!millis) return 'Just now'

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(millis))
}

export function getDisplayName(profile: Pick<UserProfile, 'firstName' | 'lastName' | 'email'> | null) {
  if (!profile) return 'Customer'
  const name = `${profile.firstName} ${profile.lastName}`.trim()
  return name || profile.email
}

export function getInitials(profile: Pick<UserProfile, 'firstName' | 'lastName' | 'email'> | null) {
  const displayName = getDisplayName(profile)
  const parts = displayName.split(' ').filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return displayName.slice(0, 2).toUpperCase()
}

export async function getUserProfile(uid: string) {
  const { db } = requireFirebaseServices()
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? ({ uid: snapshot.id, ...snapshot.data() } as UserProfile) : null
}

export async function createCustomerProfile(uid: string, data: RegistrationData) {
  const { db } = requireFirebaseServices()
  const batch = writeBatch(db)
  const currentBalance = defaultAccountBalances.current

  const profile: UserProfile = {
    uid,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    ssn: data.ssn,
    address: data.address,
    country: data.country,
    gender: data.gender,
    occupation: data.occupation,
    monthlySalary: data.monthlySalary,
    sourceOfIncome: data.sourceOfIncome,
    role: 'customer',
    status: 'Active',
    balance: currentBalance,
    notificationPreferences: defaultNotifications,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  batch.set(doc(db, 'users', uid), profile)

  const accounts: Array<Omit<BankAccount, 'createdAt' | 'updatedAt'>> = [
    {
      id: `${uid}_current`,
      userId: uid,
      type: 'current',
      label: 'Current Account',
      accountNumber: accountNumberFor(uid, 'current'),
      balance: defaultAccountBalances.current,
      currency: 'USD',
      isPrimary: true,
    },
    {
      id: `${uid}_savings`,
      userId: uid,
      type: 'savings',
      label: 'Savings Account',
      accountNumber: accountNumberFor(uid, 'savings'),
      balance: defaultAccountBalances.savings,
      currency: 'USD',
      isPrimary: false,
    },
    {
      id: `${uid}_isa`,
      userId: uid,
      type: 'isa',
      label: 'Cash ISA',
      accountNumber: accountNumberFor(uid, 'isa'),
      balance: defaultAccountBalances.isa,
      currency: 'USD',
      isPrimary: false,
    },
  ]

  accounts.forEach((account) => {
    batch.set(doc(db, 'accounts', account.id), {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()
  return profile
}

export async function createAdminProfile(uid: string, email: string) {
  if (!isBootstrapAdminEmail(email)) {
    throw new Error('This email is not allowed to create an admin profile.')
  }

  const { db } = requireFirebaseServices()
  const profile: UserProfile = {
    uid,
    email,
    firstName: 'Harry',
    lastName: 'Eriksen',
    phone: '',
    ssn: '',
    address: '',
    country: '',
    gender: '',
    occupation: 'Administrator',
    monthlySalary: '',
    sourceOfIncome: '',
    role: 'admin',
    status: 'Active',
    balance: 0,
    notificationPreferences: defaultNotifications,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', uid), profile, { merge: true })
  return profile
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const { db } = requireFirebaseServices()
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function updateUserStatus(uid: string, status: UserStatus) {
  await updateUserProfile(uid, { status })
}

export async function recordLogin(uid: string) {
  const { db } = requireFirebaseServices()
  await updateDoc(doc(db, 'users', uid), {
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeUserAccounts(uid: string, callback: (accounts: BankAccount[]) => void) {
  if (!db) {
    callback([])
    return (() => {}) as Unsubscribe
  }

  return onSnapshot(query(collection(db, 'accounts'), where('userId', '==', uid)), (snapshot) => {
    const accounts = snapshot.docs
      .map((item) => mapDoc<BankAccount>(item))
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    callback(accounts)
  })
}

export function subscribeUserTransactions(uid: string, callback: (transactions: Transaction[]) => void) {
  if (!db) {
    callback([])
    return (() => {}) as Unsubscribe
  }

  return onSnapshot(query(collection(db, 'transactions'), where('userId', '==', uid)), (snapshot) => {
    callback(sortNewestFirst(snapshot.docs.map((item) => mapDoc<Transaction>(item))))
  })
}

export function subscribeAllUsers(callback: (users: UserProfile[]) => void) {
  if (!db) {
    callback([])
    return (() => {}) as Unsubscribe
  }

  return onSnapshot(collection(db, 'users'), (snapshot) => {
    callback(sortNewestFirst(snapshot.docs.map((item) => mapDoc<UserProfile>(item))))
  })
}

export function subscribeAllTransactions(callback: (transactions: Transaction[]) => void) {
  if (!db) {
    callback([])
    return (() => {}) as Unsubscribe
  }

  return onSnapshot(collection(db, 'transactions'), (snapshot) => {
    callback(sortNewestFirst(snapshot.docs.map((item) => mapDoc<Transaction>(item))))
  })
}

export function subscribeAllAccounts(callback: (accounts: BankAccount[]) => void) {
  if (!db) {
    callback([])
    return (() => {}) as Unsubscribe
  }

  return onSnapshot(collection(db, 'accounts'), (snapshot) => {
    callback(snapshot.docs.map((item) => mapDoc<BankAccount>(item)))
  })
}

export interface AdminDepositPayload {
  user: UserProfile
  account: BankAccount
  senderName: string
  amount: number
  currency: string
  reference: string
  dateTime: string
}

export async function createAdminDeposit(payload: AdminDepositPayload) {
  const { db } = requireFirebaseServices()
  const amount = Number(payload.amount)

  if (amount <= 0) {
    throw new Error('Enter a valid deposit amount.')
  }

  const batch = writeBatch(db)
  const transactionRef = doc(collection(db, 'transactions'))
  const createdAt = payload.dateTime ? Timestamp.fromDate(new Date(payload.dateTime)) : serverTimestamp()

  batch.set(transactionRef, {
    userId: payload.user.uid,
    userName: getDisplayName(payload.user),
    type: 'Deposit',
    title: `Deposit from ${payload.senderName}`,
    amount,
    fee: 0,
    total: amount,
    currency: payload.currency,
    status: 'Completed',
    fromAccountId: payload.account.id,
    fromAccountLabel: payload.account.label,
    senderName: payload.senderName,
    recipientName: getDisplayName(payload.user),
    recipientAccount: payload.account.accountNumber ?? payload.account.id,
    reference: payload.reference,
    createdAt,
    updatedAt: serverTimestamp(),
  })

  batch.update(doc(db, 'accounts', payload.account.id), {
    balance: increment(amount),
    updatedAt: serverTimestamp(),
  })

  if (payload.account.isPrimary) {
    batch.update(doc(db, 'users', payload.user.uid), {
      balance: increment(amount),
      updatedAt: serverTimestamp(),
    })
  }

  await batch.commit()
  return transactionRef.id
}

export async function approveTransaction(transaction: Transaction) {
  if (!transaction.fromAccountId) {
    throw new Error('This transaction does not have a source account.')
  }

  const { db } = requireFirebaseServices()
  const accountSnapshot = await getDoc(doc(db, 'accounts', transaction.fromAccountId))

  if (!accountSnapshot.exists()) {
    throw new Error('Source account was not found.')
  }

  const account = { id: accountSnapshot.id, ...accountSnapshot.data() } as BankAccount
  const batch = writeBatch(db)

  batch.update(doc(db, 'transactions', transaction.id), {
    status: 'Completed',
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  if (transaction.amount < 0) {
    batch.update(doc(db, 'accounts', account.id), {
      balance: increment(transaction.total),
      updatedAt: serverTimestamp(),
    })

    if (account.isPrimary) {
      batch.update(doc(db, 'users', transaction.userId), {
        balance: increment(transaction.total),
        updatedAt: serverTimestamp(),
      })
    }
  }

  await batch.commit()
}

export async function declineTransaction(transactionId: string) {
  const { db } = requireFirebaseServices()
  await updateDoc(doc(db, 'transactions', transactionId), {
    status: 'Declined',
    declinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateTransaction(transactionId: string, data: Partial<Transaction> & { createdAtInput?: string }) {
  const { db } = requireFirebaseServices()
  const { createdAtInput, ...transactionData } = data
  await updateDoc(doc(db, 'transactions', transactionId), {
    ...transactionData,
    ...(createdAtInput ? { createdAt: Timestamp.fromDate(new Date(createdAtInput)) } : {}),
    updatedAt: serverTimestamp(),
  })
}

export async function resetUserTransactions(userId: string) {
  const { db } = requireFirebaseServices()
  const snapshot = await getDocs(query(collection(db, 'transactions'), where('userId', '==', userId)))
  const batch = writeBatch(db)

  snapshot.docs.forEach((transaction) => {
    batch.delete(transaction.ref)
  })

  await batch.commit()
}

export async function createTransfer(
  profile: UserProfile,
  account: BankAccount,
  payload: TransferPayload
) {
  const { db } = requireFirebaseServices()
  const amount = Number(payload.amount)
  const fee = payload.transferType === 'international' ? Number((amount * 0.015).toFixed(2)) : 0
  const total = Number((amount + fee).toFixed(2))

  if (amount <= 0) {
    throw new Error('Enter a valid transfer amount.')
  }

  const batch = writeBatch(db)
  const transactionRef = doc(collection(db, 'transactions'))
  const type =
    payload.transferType === 'international'
      ? 'International Transfer'
      : payload.transferType === 'bills'
        ? 'Bill Payment'
        : 'Transfer'

  batch.set(transactionRef, {
    userId: profile.uid,
    userName: getDisplayName(profile),
    type,
    transferType: payload.transferType,
    title:
      payload.transferType === 'bills'
        ? `Bill payment to ${payload.recipientName}`
        : `Transfer to ${payload.recipientName}`,
    amount: -amount,
    fee,
    total: -total,
    currency: payload.currency,
    status: 'Pending',
    fromAccountId: account.id,
    fromAccountLabel: account.label,
    recipientName: payload.recipientName,
    recipientAccount: payload.recipientAccount,
    recipientAddress: payload.recipientAddress ?? '',
    recipientCountry: payload.recipientCountry ?? '',
    recipientPhone: payload.recipientPhone ?? '',
    sortCode: payload.sortCode,
    bankName: payload.bankName,
    reference: payload.reference,
    billType: payload.billType ?? '',
    billAccount: payload.billAccount ?? '',
    createdAt: serverTimestamp(),
  })

  await batch.commit()
  return transactionRef.id
}

