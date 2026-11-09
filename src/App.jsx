const API_BASE_URL = import.meta.env.VITE_API_URL || '';
import './App.css'

import { useState } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ServiceCard from './components/ServiceCard'
import FAQItem from './components/FAQItem'
import Chatbot from './components/Chatbot'

const services = [
  {
    icon: '💻',
    title: 'Web Development',
    description:
      'We build responsive, modern and user-friendly websites for businesses.',
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    description:
      'Powerful mobile applications designed to improve customer experience.',
  },
  {
    icon: '🤖',
    title: 'Artificial Intelligence',
    description:
      'Smart AI solutions that automate processes and improve productivity.',
  },
  {
    icon: '☁️',
    title: 'Cloud Solutions',
    description:
      'Secure and scalable cloud services for modern businesses.',
  },
  {
    icon: '🔐',
    title: 'Cyber Security',
    description:
      'Protect your business with reliable security and data protection.',
  },
  {
    icon: '⚙️',
    title: 'Software Development',
    description:
      'Custom software solutions built around your business requirements.',
  },
]

const defaultFaqs = [
  {
    question: 'What services does TechNova provide?',
    answer:
      'TechNova provides web and mobile app development, custom software, AI solutions, cloud services and cybersecurity.',
  },
  {
    question: 'Can you build a custom website for my business?',
    answer:
      'Yes. We build responsive websites tailored to your goals, audience and business requirements.',
  },
  {
    question: 'Do you develop mobile applications?',
    answer:
      'Yes. We can help plan and develop mobile applications based on your users, features and target platforms.',
  },
  {
    question: 'How much does a project cost?',
    answer:
      'Pricing depends on the scope, features and timeline. Contact us with your requirements for a project-specific estimate.',
  },
  {
    question: 'How long does a project take?',
    answer:
      "Timelines depend on the project's complexity and requirements. We provide an estimate after discussing the scope.",
  },
  {
    question: 'Can you help with an existing project?',
    answer:
      'Yes. Contact us with details about your current product and the support or improvements you need.',
  },
  {
    question: 'How do you protect project data?',
    answer:
      'We consider security throughout the development process and can discuss safeguards appropriate to your project.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Contact TechNova with your goals and requirements. We can discuss the right solution and next steps.',
  },
]

const getOfflineChatReply = (message) => {
  const question = message.toLowerCase()

  if (/(price|cost|pricing|budget|quote)/.test(question)) {
    return 'Project pricing depends on its scope and features. Share your requirements with TechNova for a tailored estimate.'
  }
  if (/(time|timeline|long|deadline)/.test(question)) {
    return 'Project timelines depend on the scope and requirements. Tell us about your project and we can discuss an estimate.'
  }
  if (/(web|website)/.test(question)) {
    return 'TechNova builds responsive websites tailored to your business goals, including planning, design and development.'
  }
  if (/(mobile|app|application)/.test(question)) {
    return 'TechNova develops mobile applications around your users and requirements. What features and platforms do you have in mind?'
  }
  if (/(ai|artificial intelligence)/.test(question)) {
    return 'TechNova can help identify and build AI solutions that automate processes or improve productivity.'
  }
  if (/cloud/.test(question)) {
    return 'TechNova provides secure, scalable cloud solutions for businesses.'
  }
  if (/(security|cyber|protect)/.test(question)) {
    return 'TechNova offers cybersecurity and data-protection services tailored to your project.'
  }

  return 'TechNova helps businesses with web and mobile development, custom software, AI, cloud and cybersecurity. What would you like to know?'
}

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const [faqContent, setFaqContent] = useState(defaultFaqs)

  const [isFaqLoading, setIsFaqLoading] = useState(false)

  const [faqError, setFaqError] = useState('')

  // Gemini API call for chatbot
  const sendMessageToGemini = async (prompt, history) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          history: history.map((msg) => ({
            role: msg.role,
            text: msg.text,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error(data.error || 'Chatbot request failed')
      }

      return data.reply
    } catch (error) {
      console.error('Chatbot API unavailable; using offline response.', error)
      return `I'm in offline mode right now. ${getOfflineChatReply(prompt)}`
    }
  }

  // Generate FAQs using Gemini
  const generateFAQ = async () => {
    setIsFaqLoading(true)
    setFaqError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-faq`, { method: 'POST' })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'FAQ generation failed')
      }

      if (!Array.isArray(data.faqs)) {
        throw new Error('FAQ response was invalid')
      }

      setFaqContent(data.faqs)
    } catch (error) {
      console.error(error)
      setFaqError(error.message)
    } finally {
      setIsFaqLoading(false)
    }
  }

  // Contact form
  const handleContact = (e) => {
    e.preventDefault()
    alert('Thank you! Your message has been received.')
    e.target.reset()
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center pt-24 px-6"
      >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-cyan-400 font-semibold tracking-widest mb-5">
              INNOVATION • TECHNOLOGY • FUTURE
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Building the
              <span className="text-cyan-400"> Digital </span>
              Future.
            </h1>

            <p className="text-gray-300 text-lg mt-7 leading-8 max-w-xl">
              We transform ideas into powerful digital experiences
              through innovative technology and smart software solutions.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <a
                href="#services"
                className="bg-cyan-500 text-slate-950 px-7 py-3 rounded-full font-bold hover:bg-cyan-300 transition"
              >
                Explore Services →
              </a>

              <a
                href="#contact"
                className="border border-white px-7 py-3 rounded-full hover:bg-white hover:text-slate-950 transition"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border border-cyan-400/40 flex items-center justify-center bg-cyan-400/5 shadow-[0_0_100px_rgba(34,211,238,0.15)]">
              <div className="text-9xl">💡</div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gray-50 scroll-mt-20">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-cyan-600 font-semibold tracking-widest">
              WHAT WE DO
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 mt-3">
              Our Services
            </h2>

            <p className="text-gray-500 mt-4">
              Technology solutions to help your business grow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-slate-950 text-white scroll-mt-20">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          <div>
            <p className="text-cyan-400 font-semibold tracking-widest">
              ABOUT TECHNOVA
            </p>

            <h2 className="text-3xl sm:text-5xl font-bold mt-4 leading-tight">
              Turning Ideas Into
              <span className="text-cyan-400"> Innovation.</span>
            </h2>

            <p className="text-gray-300 mt-7 leading-8">
              TechNova is a technology-focused company committed to
              delivering innovative digital solutions. We combine
              creativity, technical expertise and modern technologies
              to help businesses succeed in a digital world.
            </p>

            <p className="text-gray-300 mt-5 leading-8">
              Our goal is to build meaningful technology experiences
              that solve real-world problems and create long-term value.
            </p>

            <a
              href="#contact"
              className="inline-block mt-8 bg-cyan-500 text-slate-950 px-7 py-3 rounded-full font-bold hover:bg-cyan-300 transition"
            >
              Work With Us
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5">

            {[
              ['Innovation', 'Creative solutions'],
              ['Quality', 'Reliable products'],
              ['Technology', 'Modern tools'],
              ['Growth', 'Future focused'],
            ].map(([title, description]) => (
              <div
                key={title}
                className="bg-slate-800 p-7 rounded-2xl border border-slate-700"
              >
                <h3 className="text-xl font-bold text-cyan-400">
                  {title}
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  {description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-white scroll-mt-20">

        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-cyan-600 font-semibold tracking-widest">
              NEED HELP?
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-slate-950">
              Frequently Asked Questions
            </h2>

            <p className="text-gray-500 mt-4">
              Discover answers to common questions about our company.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <button
              onClick={generateFAQ}
              disabled={isFaqLoading}
              className="bg-slate-950 text-white px-7 py-3 rounded-full hover:bg-cyan-600 transition disabled:opacity-50"
            >
              {isFaqLoading ? 'Generating FAQs...' : '✨ Generate AI FAQs'}
            </button>
          </div>

          {isFaqLoading && (
            <div className="text-center py-10 text-cyan-600">
              <p className="text-lg font-semibold">
                Refreshing questions using AI...
              </p>
            </div>
          )}

          {faqError && (
            <div className="text-center text-red-500 py-5">
              {faqError}
              <button
                onClick={generateFAQ}
                className="block mx-auto mt-3 underline"
              >
                Try again
              </button>
            </div>
          )}

          {faqContent.length > 0 && (
            <div>
              {faqContent.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-gray-50 scroll-mt-20">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14">

          <div>
            <p className="text-cyan-600 font-semibold tracking-widest">
              GET IN TOUCH
            </p>

            <h2 className="text-3xl sm:text-5xl font-bold text-slate-950 mt-4">
              Let's Build Something Great Together.
            </h2>

            <p className="text-gray-600 mt-7 leading-8">
              Have an idea or project in mind? Contact us and let's
              discuss how we can help your business grow.
            </p>

            <div className="mt-10 space-y-5 text-gray-700">
              <p>📧 hello@technova.com</p>
              <p>📍 India</p>
              <p>💻 Digital Solutions Worldwide</p>
            </div>
          </div>

          <form
            onSubmit={handleContact}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-5"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="text"
              placeholder="Subject"
              required
              className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              required
              className="w-full border border-gray-200 rounded-lg p-4 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="submit"
              className="w-full bg-slate-950 text-white p-4 rounded-lg font-bold hover:bg-cyan-600 transition"
            >
              Send Message →
            </button>
          </form>

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot Toggle */}
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-cyan-500 text-slate-950 text-3xl shadow-xl hover:scale-110 transition"
        aria-label="Open chatbot"
      >
        {isChatbotOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot */}
      {isChatbotOpen && (
        <Chatbot
          onSend={sendMessageToGemini}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}

    </div>
  )
}

export default App