import { useState } from 'react'

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-semibold text-slate-900"
      >
        <span>{question}</span>
        <span className="text-cyan-600 text-xl">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <p className="mt-4 text-gray-600 leading-7">
          {answer}
        </p>
      )}
    </div>
  )
}

export default FAQItem