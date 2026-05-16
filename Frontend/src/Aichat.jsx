import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const AIChat = () => {

  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const chatEndRef = useRef(null)

  // Auto scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim()) {
      alert("Please enter a question")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        'http://localhost:5000/api/chat',
        {
          message: question
        }
      )

      const aiResponse = res.data.reply

      setResponse(aiResponse)

      // Save chat history
      setHistory((prev) => [
        ...prev,
        {
          question,
          answer: aiResponse
        }
      ])

      setQuestion('')

    } catch (error) {
      console.log(error)
      setResponse("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Clear Chat
  const clearChat = () => {
    setHistory([])
    setResponse('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-black text-white flex">

      {/* Sidebar */}
      <div className="w-[30%] border-r border-gray-700 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Chat History</h2>

          <button
            onClick={clearChat}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm"
          >
            Clear
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-xl text-gray-400 text-center">
            No chat history
          </div>
        ) : (
          history.map((chat, index) => (
            <div key={index} className="mb-6 space-y-3">

              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl max-w-[90%]">
                  {chat.question}
                </div>
              </div>

              {/* AI message */}
              <div className="flex justify-start">

                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white px-4 py-3 rounded-2xl max-w-[90%]">
                    <p className="font-semibold text-green-300 mb-1">AI</p>

                    <p className="text-sm text-gray-300">
                      {chat.answer.length > 120
                        ? chat.answer.slice(0, 120) + "..."
                        : chat.answer}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
      <div className="flex-1 p-10 flex flex-col">

        <div className="mb-6">
          <h1 className="text-4xl font-bold">AI Chat Assistant</h1>
          <p className="text-gray-400 mt-2">
            Ask questions and get AI-powered answers instantly
          </p>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl">

          {history.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Start the conversation 👋
            </p>
          )}

          {history.map((chat, index) => (
            <div key={index} className="mb-6 space-y-3">

        
              <div className="flex justify-end">
                <div className="bg-blue-500 px-4 py-3 rounded-2xl max-w-[70%]">
                  {chat.question}
                </div>
              </div>

          
              <div className="flex justify-start">
                <div className="bg-gray-700 px-4 py-3 rounded-2xl max-w-[70%] whitespace-pre-wrap">
                  {chat.answer}
                </div>
              </div>

            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
          <textarea
            rows="2"
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-gray-900 border border-gray-600 outline-none focus:border-white resize-none"
          />

          <button
            type="submit"
            className="bg-white text-black px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default AIChat