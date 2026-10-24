import '../index.css'
import './Quiz.css'
import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'


export default function Quiz({questions=[]}) {
    const [number, setNumber] = useState(eval(localStorage.getItem('number')) || 0)
    const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem('answers')) || {})
    const [selected, setSelected] = useState(JSON.parse(localStorage.getItem('answers'))[number])
    const [progress, setProgress] = useState(0)
    
    function Option({arr=[], value}) {
        const pos = arr.indexOf(value)
        const poses = ['A', 'B', 'C', 'D', 'E']
        return (
            <div className={`${answers[number]==pos && 'active'} option`} onClick={() => {
                setSelected(pos)
            }}>
                <span className='letter'>{poses[pos]}</span>
                <span className='content'>{value}</span>
            </div>
        )
    }
    
    useEffect(() => {
        localStorage.setItem('number', number)
    }, [number])

    useEffect (() => {
        if (selected || selected==0){
            const tmpObj = {
                ...answers, [number]: selected
            }
            setProgress((Object.entries(tmpObj).length/questions.length)*100)

            setAnswers(tmpObj)
            localStorage.setItem('answers', JSON.stringify(tmpObj))
        }
    }, [selected])

    return (
        <>
            <main className="modal main">
                <section className="top section">
                    <span className='count'>Question {number+1} out of {questions.length}</span>
                    <span>Choose one answer</span>
                    <div className='progress-container'>
                        <div className='progress-value' style={{width: `${progress}%`}}></div>
                    </div>
                </section> 
                <section className='section mid'>
                    <span className='question'>{questions[number].question}</span>
                    <div className='choices'>
                        {questions[number].options.map((option) => {
                            return <Option key={option} arr={questions[number].options} value={option}/>
                        })}
                    </div>
                </section>
                <section className='section footer'>
                    <button className={`button btn ${number > 0 ? 'action' : 'disabled'}`} onClick={() => {
                        if (number == 0) return
                        setNumber(number-1)
                        }}><ArrowLeft /> Prev</button>
                    {number+1<questions.length ?
                    <button className='button btn button-primary action'  onClick={() => {
                            const newNumber = number+1
                            setNumber(newNumber)
                            setSelected(answers[newNumber])
                    }}>Next <ArrowRight/></button>:
                    <Link className='button btn button-primary action' to={`/result?results=${btoa(JSON.stringify(answers))}`}>Submit</Link>}
                </section>
            </main>
        </>
    )
}