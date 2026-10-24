import '../index.css'
import './Quiz.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import LZString from 'lz-string'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function readStored(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw === null ? fallback : JSON.parse(raw)
    } catch {
        return fallback
    }
}

function Option({ index, label, selected, onSelect }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            className={`option ${selected ? 'active' : ''}`}
            onClick={() => onSelect(index)}
        >
            <span className="letter">{LETTERS[index]}</span>
            <span className="content">{label}</span>
            {selected && <Check className="option-check" size={18} aria-hidden="true" />}
        </button>
    )
}

export default function Quiz({ questions = [] }) {
    const total = questions.length

    const [number, setNumber] = useState(() => {
        const stored = Number(readStored('number', 0))
        return Number.isInteger(stored) && stored >= 0 ? stored : 0
    })
    const [answers, setAnswers] = useState(() => {
        const stored = readStored('answers', {})
        return stored && typeof stored === 'object' ? stored : {}
    })

    // Never index past the end, even if saved progress is stale or questions load late
    const current = Math.min(number, Math.max(total - 1, 0))

    useEffect(() => {
        if (total === 0) return
        localStorage.setItem('number', current)
    }, [current, total])

    useEffect(() => {
        localStorage.setItem('answers', JSON.stringify(answers))
    }, [answers])

    const selectAnswer = (index) =>
        setAnswers((prev) => ({ ...prev, [current]: index }))

    if (total === 0) {
        return (
            <main className="modal main main-empty">
                <p className="prompt">No questions available.</p>
            </main>
        )
    }

    const question = questions[current]
    const selectedIndex = answers[current]
    const isFirst = current === 0
    const isLast = current === total - 1

    const answeredCount = Object.keys(answers).filter((key) => Number(key) < total).length
    const progress = (answeredCount / total) * 100

    const resultsParam = LZString.compressToEncodedURIComponent(JSON.stringify(answers))
    const questsParam = LZString.compressToEncodedURIComponent(JSON.stringify(questions.map((q) => q.id)))

    return (
        <main className="modal main">
            <header className="section top">
                <span className="count">Question {current + 1} of {total}</span>
                <span className="prompt">Choose one answer</span>
                <div
                    className="progress-container"
                    role="progressbar"
                    aria-label="Questions answered"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={answeredCount}
                >
                    <div className="progress-value" style={{ width: `${progress}%` }} />
                </div>
            </header>

            <section className="section mid" key={current}>
                <h2 className="question" id="question-text">{question.question}</h2>
                <div className="choices" role="radiogroup" aria-labelledby="question-text">
                    {question.options.map((option, i) => (
                        <Option
                            key={i}
                            index={i}
                            label={option}
                            selected={selectedIndex === i}
                            onSelect={selectAnswer}
                        />
                    ))}
                </div>
            </section>

            <footer className="section footer">
                <button
                    type="button"
                    className="button btn button-ghost action"
                    disabled={isFirst}
                    onClick={() => setNumber(current - 1)}
                >
                    <ArrowLeft size={18} /> Prev
                </button>

                {isLast ? (
                    <Link
                        className="button btn button-primary action"
                        to={`/result?results=${resultsParam}&quests=${questsParam}`}
                    >
                        Submit
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="button btn button-primary action"
                        onClick={() => setNumber(current + 1)}
                    >
                        Next <ArrowRight size={18} />
                    </button>
                )}
            </footer>
        </main>
    )
}