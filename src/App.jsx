import { Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import Quiz from './Pages/Quiz.jsx'
import Topbar from './Components/Top-bar'
import Results from './Pages/Results'
import { useState, useEffect } from 'react'

function App() {
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('questions')) || [])

  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Landing QuestionList={questions} setQuestionList={setQuestions} />}/>
        <Route path="/quiz" element={<Quiz questions={questions}/>}/>
        <Route path='/result' element={<Results questions={questions}/>}/>
      </Routes>
    </>
  )
}

export default App
