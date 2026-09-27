import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc,
  getDoc,
} from 'firebase/firestore'
import {
  auth,
  db,
} from './firebase'

export type StaffRole =
  | 'MANAGER'
  | 'KITCHEN'
  | 'SERVER'

export type StaffProfile = {
  uid: string
  name: string
  email: string
  role: StaffRole
  restaurantId: string
  active: boolean
}

export async function loginStaff(
  email: string,
  password: string,
): Promise<StaffProfile> {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    )

  const user = credential.user

  const staffRef = doc(
    db,
    'staff',
    user.uid,
  )

  const snapshot = await getDoc(staffRef)

  if (!snapshot.exists()) {
    await signOut(auth)

    throw new Error(
      'This account does not have a staff profile.',
    )
  }

  const data = snapshot.data()

  if (!data.active) {
    await signOut(auth)

    throw new Error(
      'This staff account is inactive.',
    )
  }

  return {
    uid: user.uid,
    name: data.name,
    email: data.email,
    role: data.role as StaffRole,
    restaurantId: data.restaurantId,
    active: data.active,
  }
}

export async function logoutStaff() {
  await signOut(auth)
}

export async function getStaffProfile(
  uid: string,
): Promise<StaffProfile | null> {
  const snapshot = await getDoc(
    doc(db, 'staff', uid),
  )

  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()

  return {
    uid,
    name: data.name,
    email: data.email,
    role: data.role as StaffRole,
    restaurantId: data.restaurantId,
    active: data.active,
  }
}