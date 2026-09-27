import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

export async function verifyTableCode(
  code: string,
  expectedTableId?: string,
) {
  const normalizedCode = code
    .trim()
    .toUpperCase()

  if (!normalizedCode) {
    throw new Error(
      'Please enter the verification code displayed on your table.',
    )
  }

  const tablesRef = collection(db, 'tables')

  const conditions = [
    where(
      'verificationCode',
      '==',
      normalizedCode,
    ),
    where('active', '==', true),
  ]

  if (expectedTableId) {
    conditions.push(
      where(
        'restaurantId',
        '==',
        'spice-garden',
      ),
    )
  }

  try {
    const tableQuery = query(
      tablesRef,
      ...conditions,
      limit(1),
    )

    const snapshot = await getDocs(tableQuery)

    if (snapshot.empty) {
      throw new Error(
        'Invalid verification code. Please check the code on your table.',
      )
    }

    const tableDocument = snapshot.docs[0]
    const table = tableDocument.data()

    // If customer arrived through a table QR,
    // the code must belong to that exact table.
    if (
      expectedTableId &&
      tableDocument.id !== expectedTableId
    ) {
      throw new Error(
        'This verification code does not belong to the table you scanned.',
      )
    }

    return {
      restaurantId: table.restaurantId,
      restaurantName: 'Spice Garden',
      tableId: tableDocument.id,
      tableNumber: table.tableNumber,
      verificationCode:
        table.verificationCode,
      customerSessionId: `guest-${Date.now()}`,
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message.startsWith(
          'Invalid verification code',
        ) ||
        error.message.startsWith(
          'This verification code',
        )
      )
    ) {
      throw error
    }

    console.error(
      'Firestore table verification failed:',
      error,
    )

    throw new Error(
      'Unable to verify your table right now. Please try again.',
    )
  }
}