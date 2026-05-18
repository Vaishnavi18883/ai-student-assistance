import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useUser } from './context/UserContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const AIChat = () => {
  const { user } = useUser()

  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim()) {
      return
    }

    try {
      setLoading(true)

      // Add to history optimistically for better UX
      const newQuestion = question;
      setQuestion('')

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: newQuestion,
          learnerId: user?.id
        }
      )

      const aiResponse = res.data.reply
      setResponse(aiResponse)

      setHistory((prev) => [
        ...prev,
        {
          question: newQuestion,
          answer: aiResponse,
          learnerId: user?.id,
          createdAt: new Date()
        }
      ])

    } catch (error) {
      console.log(error)
      setHistory((prev) => [
        ...prev,
        {
          question: question,
          answer: "Sorry, I encountered an error. Please try again.",
          learnerId: user?.id,
          createdAt: new Date()
        }
      ])
      setQuestion('')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setHistory([])
    setResponse('')
  }

  return (
    <div className="bg-[#0f172a] text-white flex h-screen overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-[320px] bg-[#111c33]/40 border-r border-white/5 flex-col hidden lg:flex relative backdrop-blur-2xl z-20 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-widest text-white/50 uppercase">
            Chat History
          </h2>
          {history.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs bg-white/5 hover:bg-red-500/20 hover:text-red-400 px-3 py-1.5 rounded-lg transition-colors border border-white/5 hover:border-red-500/30"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence>
            {history.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 opacity-40"
              >
                <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p className="text-sm">Your conversations will appear here.</p>
              </motion.div>
            ) : (
              history.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group hover:shadow-lg hover:border-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    <p className="text-xs text-white/50 font-medium truncate">You asked</p>
                  </div>
                  <p className="text-sm font-medium text-white/90 line-clamp-2 leading-relaxed group-hover:text-blue-400 transition-colors">
                    {chat.question}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a233a] via-[#0f172a] to-[#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/10 group">
              <svg className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-sm text-white">✨</span>
                </span>
                AI Assistant
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider text-green-400 uppercase">Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
          <AnimatePresence>
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 rounded-full"></div>
                  <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 relative border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <span className="text-5xl">✨</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">How can I help you today?</h2>
                  <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                    Ask me anything about your studies, tasks, or exam preparation. I'm here to assist you 24/7.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center max-w-2xl mt-8">
                  {['Summarize my notes', 'Explain quantum physics', 'Help with math', 'Write an essay outline'].map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setQuestion(suggestion)}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-sm text-white/70 transition-all hover:-translate-y-0.5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              history.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4 rounded-[2rem] rounded-tr-sm max-w-[85%] md:max-w-[75%] shadow-lg shadow-blue-500/20 text-[15px] leading-relaxed border border-white/10">
                      {chat.question}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="flex gap-4 max-w-[90%] md:max-w-[80%]">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/20 mt-1">
                        <span className="text-lg">🤖</span>
                      </div>
                      <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 px-6 py-5 rounded-[2rem] rounded-tl-sm shadow-xl text-[15px] leading-relaxed whitespace-pre-wrap text-white/90">
                        {chat.answer}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/20 mt-1">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 px-6 py-5 rounded-[2rem] rounded-tl-sm shadow-xl flex items-center gap-2 h-[68px]">
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} className="h-4" />
        </div>

        {/* Input Form */}
        <div className="p-6 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent relative z-20">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-[#1e293b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl focus-within:border-white/20 transition-colors">
              <input
                type="text"
                placeholder="Ask anything..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                className="flex-1 px-6 py-5 bg-transparent outline-none text-white/90 placeholder-white/40 text-[15px] w-full"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="mr-3 p-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30"
              >
                <svg className="w-5 h-5 text-white translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-white/30 tracking-wide">AI can make mistakes. Consider verifying important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat