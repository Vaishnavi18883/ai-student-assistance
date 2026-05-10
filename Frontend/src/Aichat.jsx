import React, { useState } from 'react'
import axios from 'axios'

const AIChat = () => {

  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState([])

  // Handle Submit

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!question) {
      alert("Please enter a question")
      return
    }

    try {

      setLoading(true)

      // API Call

      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        {
          question: question
        }
      )

      const aiResponse = res.data.response

      setResponse(aiResponse)

      // Save Chat History

      setHistory([
        ...history,
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

  return (

  <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-black text-white flex">

    {/* Left Sidebar */}

    <div className="w-[30%] border-r border-gray-700 p-6 overflow-y-auto">

      <h2 className="text-2xl font-bold mb-6">
        Chat History
      </h2>

      <div className="space-y-4">

        {history.length === 0 ? (

          <div className="bg-gray-800 p-4 rounded-xl text-gray-400 text-center">
            No chat history
          </div>

        ) : (

          history.map((chat, index) => (

            <div
              key={index}
              className="bg-gray-800 p-4 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300"
            >

              <p className="font-semibold text-blue-400 mb-2">
                Question
              </p>

              <p className="text-sm text-gray-300 line-clamp-3">
                {chat.question}
              </p>

            </div>

          ))

        )}

      </div>

    </div>

    {/* Right Chat Area */}

    <div className="flex-1 p-10">

      {/* Heading */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          AI Chat Assistant
        </h1>

        <p className="text-gray-400 mt-2">
          Ask questions and get AI-powered answers instantly
        </p>

      </div>

      {/* Chat Form */}

      <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <textarea
            rows="5"
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-600 outline-none focus:border-white resize-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
          >

            {loading ? "Generating..." : "Ask AI"}

          </button>

        </form>

      </div>

      {/* AI Response */}

      {response && (

        <div className="mt-10 bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">

          <h2 className="text-2xl font-bold mb-5">
            AI Response
          </h2>

          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {response}
          </p>

        </div>

      )}

    </div>

  </div>
)}


export default AIChat