import { useRef, useState } from 'react'
import { Bot, MessageCircle, Send, X } from 'lucide-react'

type ChatMessage = {
  id: number
  sender: 'bot' | 'user'
  text: string
}

const quickQuestions = [
  'What do you recommend?',
  'How do I place an order?',
  'How can I request the bill?',
]

function getReply(message: string) {
  const question = message.toLowerCase()

  if (question.includes('recommend') || question.includes('popular')) {
    return 'Our Garlic Naan, Paneer Butter Masala, Chicken Biryani, and Fresh Lime Soda are popular choices. You can open any dish to see portions, spice levels, and add-ons.'
  }

  if (question.includes('order') || question.includes('cart')) {
    return 'Choose a dish, select your portion and spice level, then tap Add to Cart. Open the cart when you are ready and place the order for your verified table.'
  }

  if (question.includes('bill') || question.includes('receipt') || question.includes('pay')) {
    return 'After finishing your meal, open your order confirmation and tap Request Receipt. The server will receive the request and confirm payment.'
  }

  if (question.includes('status') || question.includes('ready')) {
    return 'Tap View Live Order Status on your order confirmation to follow preparation, ready, and served updates.'
  }

  if (question.includes('table')) {
    return 'Your order is automatically assigned to the table you verified. Please ask a staff member if you need help changing tables.'
  }

  return 'I can help with dish recommendations, placing an order, order status, receipts, and table service. What would you like to know?'
}

export default function CustomerChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const nextMessageId = useRef(2)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I’m your Spice Garden assistant. How can I help you today?',
    },
  ])

  const sendMessage = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const id = nextMessageId.current
    nextMessageId.current += 2
    setMessages((current) => [
      ...current,
      { id, sender: 'user', text: trimmed },
      { id: id + 1, sender: 'bot', text: getReply(trimmed) },
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[min(520px,calc(100vh-120px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-[26px] border border-orange-100 bg-white shadow-2xl shadow-neutral-900/20">
          <header className="flex items-center justify-between bg-orange-500 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Bot size={21} />
              </div>
              <div>
                <p className="font-black">Spice Garden Assistant</p>
                <p className="text-xs text-orange-100">Here to help with your order</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-2 transition hover:bg-white/15"
            >
              <X size={19} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fffaf4] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${
                    message.sender === 'user'
                      ? 'rounded-br-md bg-orange-500 text-white'
                      : 'rounded-bl-md bg-white text-neutral-700 shadow-sm'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="shrink-0 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-700"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5"
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the menu..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-neutral-400"
                aria-label="Message the restaurant assistant"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close restaurant assistant' : 'Open restaurant assistant'}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-600"
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  )
}
