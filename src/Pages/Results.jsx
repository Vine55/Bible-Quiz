import './Results.css'
import '../index.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Question(ques, ans) {

    return (
        <>

        </>
    )
}



export default function Results({questions}) {
    const params = new URLSearchParams(window.location.search)
    const navigate = useNavigate()
    let tmpScore = 0
    const [results, setResults] = useState(JSON.parse(atob(params.get('results'))))
    const [score, setScore] = useState(0)
    const [wrong, setWrong] = useState(0)
    const [percent, setPercent] = useState(0)
    const [tab, setTab] = useState('all') // all | wrong | correct

    let total = questions.length
    
    function check(index, results) {
        const answer = questions[index].answer
        const choice = questions[index].options[results[index]]
        
        
        
        return (answer == choice)
    }

    useEffect(() => {
        if (!params.get("results")) navigate('/')
        tmpScore=0

        Object.keys(results).forEach((i) => {
            const index = eval(i)
            if (check(i, results)) {
                tmpScore++
                setScore(tmpScore)
            }
        })
        setWrong(total-tmpScore)
        setPercent(tmpScore/total*100)
    }, [])


    
    return (
        <>
            <main className='main'>
                <header className='head section'>
                    <div className='score-container heading'>
                        <span className='subtext'>Your Score</span>
                        <p className='score'>{percent}%</p>
                        <span className='subtext'>{score} out of {total} correct</span>
                    </div>
                    <div className='actions'>
                        <button className='button button-primary'>Try again</button>
                        <button className='button'>Change Settings</button>
                    </div>
                </header>
                <section className='section body'>
                    <div className='results-nav'>
                        <p className='nav-head'>Review your answers</p>
                        <div className='tabs'>
                            <span className={`tab ${tab=='all' && "active-tab"}`} onClick={() => {setTab('all')}}>All {total}</span>
                            <span className={`tab ${tab=='correct' && "active-tab"}`} onClick={() => {setTab('correct')}}>Correct {score}</span>
                            <span className={`tab ${tab=='wrong' && "active-tab"}`} onClick={() => {setTab('wrong')}}>Wrong {wrong}</span>
                        </div>
                    </div>
                    <div className='questions'>
                        {questions.map((quest) => {
                            const index = questions.indexOf(quest)
                            const ans = quest.answer
                            const pick = quest.options[results[index]]
                            const correct = ans == pick
                            let render = false
                            if (tab=='all') {render=true}
                            if (tab=='wrong') {if (!correct) {render=true}}
                            if (tab=="correct") {if (correct) {render=true}}

                            if (render) {
                                return (
                                <div key={index} className='result'>
                                    <p className='quest'>{index+1}. {quest.question}</p>
                                    <p className={`pick ${!correct && 'wrong'}`}>Your answer: {pick}</p>
                                    {!correct && <p>Correct answer {ans}</p>}
                                </div>
                            )}
                        })}
                    </div>
                </section>
            </main>
        </>
    )
}