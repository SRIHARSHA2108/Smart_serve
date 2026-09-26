import { demoTables } from '../data/tables'

export async function verifyTableCode(code: string) {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const normalizedCode = code.trim().toUpperCase()

  const table = demoTables.find(
    (item) => item.verificationCode === normalizedCode,
  )

  if (!table) {
    throw new Error(
      'Invalid verification code. Please check the code on your table.',
    )
  }

  return {
    restaurantId: 'spice-garden',
    restaurantName: 'Spice Garden',
    tableId: table.id,
    tableNumber: table.tableNumber,
    verificationCode: table.verificationCode,
    customerSessionId: `guest-${Date.now()}`,
  }
}