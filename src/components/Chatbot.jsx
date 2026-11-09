import { useState } from 'react'

function Chatbot({ onSend, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! 👋 Welcome to TechNova. How can I help you today?',
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    const message = input.trim()

    if (!message || isLoading) return

    const updatedMessages = [
      ...messages,
      { role: 'user', text: message },
    ]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const reply = await onSend(message, messages)

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

      <div className="bg-slate-950 text-white p-5 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">TechNova AI</h3>
          <p className="text-xs text-cyan-400">Online Assistant</p>
        </div>

        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-sm leading-6 ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <p className="text-sm text-gray-500">
            TechNova AI is typing...
          </p>
        )}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
          placeholder="Ask something..."
          className="flex-1 min-w-0 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-cyan-500 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chatbot