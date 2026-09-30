import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Utensils,
} from 'lucide-react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import SmartServeLogo from '../../components/common/SmartServeLogo'
import { verifyTableCode } from '../../services/tableService'
import { useSessionStore } from '../../store/sessionStore'
import { useCartStore } from '../../store/cartStore'
import { useOrderStore } from '../../store/orderStore'

export default function TableVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const qrTableId =
    searchParams.get('table')
  const setSession = useSessionStore((state) => state.setSession)
  const clearCart = useCartStore((state) => state.clearCart)
  const clearOrders = useOrderStore((state) => state.clearOrders)

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifiedTable, setVerifiedTable] = useState<number | null>(null)

  const handleCodeChange = (value: string) => {
    const cleanValue = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)

    setCode(cleanValue)
    setError('')
  }

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault()

    if (code.length < 4) {
      setError('Please enter the verification code displayed on your table.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const session = await verifyTableCode(
        code,
        qrTableId ?? undefined,
      )

      // A new table verification starts a completely fresh customer
      // session. Do not carry the previous table's cart or order summary
      // into the new menu.
      clearCart()
      clearOrders()
      setSession(session)
      setVerifiedTable(session.tableNumber)
    } catch (err) {
      setVerifiedTable(null)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to verify this table.',
      )
    } finally {
      setLoading(false)
    }
  }

  const openMenu = () => {
    navigate('/menu')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf4]">
      <div className="absolute -left-32 top-28 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />

      <header className="relative z-10 border-b border-orange-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <SmartServeLogo />

          <div className="hidden items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:flex">
            <ShieldCheck size={15} />
            Secure table verification
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8 lg:py-14">
        <div className="hidden lg:block">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <Sparkles size={16} />
            Welcome to Spice Garden
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-neutral-900 xl:text-6xl">
            Your table.
            <br />
            Your menu.
            <br />
            <span className="text-orange-500">Your experience.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
            Verify your table to explore our digital menu, discover
            personalized recommendations and experience dishes in 3D and AR.
          </p>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            <Feature icon={<Utensils size={19} />} text="Digital Menu" />
            <Feature icon={<Sparkles size={19} />} text="AI Picks" />
            <Feature icon={<ScanLine size={19} />} text="3D & AR" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-7 text-center lg:hidden">
            <div className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-orange-500">
              Spice Garden
            </div>

            <h1 className="text-3xl font-black tracking-tight text-neutral-900">
              Welcome to Smart Serve
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Verify your table to begin your dining experience.
            </p>
          </div>

          <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-[0_24px_80px_rgba(120,70,20,0.12)] sm:p-8">
            {!verifiedTable ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <QrCode size={31} strokeWidth={2} />
                </div>

                <div className="mt-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                    Spice Garden
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900">
                    Table Verification
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                    Enter the 4–6 character verification code displayed on
                    your table.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="mt-7">
                  <label
                    htmlFor="table-code"
                    className="mb-2 block text-sm font-bold text-neutral-700"
                  >
                    Verification code
                  </label>

                  <input
                    id="table-code"
                    value={code}
                    onChange={(event) =>
                      handleCodeChange(event.target.value)
                    }
                    placeholder="A7K9"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-16 w-full rounded-2xl border-2 border-neutral-200 bg-neutral-50 px-5 text-center text-2xl font-black uppercase tracking-[0.3em] text-neutral-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight size={19} />
                      </>
                    )}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs font-bold uppercase text-neutral-400">
                    or
                  </span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <button
                  type="button"
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 font-bold text-neutral-700 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <ScanLine size={20} />
                  Scan QR Code
                </button>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-xs leading-5 text-neutral-500">
                    Your code securely identifies your restaurant table. You
                    never need to manually select a table.
                  </p>
                </div>
              </>
            ) : (
              <div className="py-5 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={42} strokeWidth={2} />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-green-600">
                  Table verified
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-tight text-neutral-900">
                  Table {verifiedTable}
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  You're all set. Explore the Spice Garden menu and discover
                  dishes made for you.
                </p>

                <button
                  type="button"
                  onClick={openMenu}
                  className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  View Menu
                  <ArrowRight size={19} />
                </button>
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-neutral-400">
            Need help? Ask a Spice Garden staff member for assistance.
          </p>
        </div>
      </section>
    </main>
  )
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-4 backdrop-blur">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <div className="text-sm font-bold text-neutral-800">{text}</div>
    </div>
  )
}
