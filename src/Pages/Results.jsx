
import './Results.css'
import '../index.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Results({ questions }) {
    const params = new URLSearchParams(window.location.search)
    const navigate = useNavigate()
    const url = `${window.location.host}/result${window.location.search}`

    let tmpScore = 0

    const [results, setResults] = useState(() => {
        const encodedResults = params.get('results')

        if (!encodedResults) return {}

        try {
            return JSON.parse(atob(encodedResults))
        } catch {
            return {}
        }
    })

    const [score, setScore] = useState(0)
    const [wrong, setWrong] = useState(0)
    const [percent, setPercent] = useState(0)
    const [tab, setTab] = useState('all')
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [copyFeedback, setCopyFeedback] = useState('')

    const total = questions.length

    function check(index, answers) {
        const answer = questions[index]?.answer
        const choice = questions[index]?.options?.[answers[index]]

        return answer === choice
    }

    useEffect(() => {
        if (!params.get('results')) {
            navigate('/')
            return
        }

        tmpScore = 0

        Object.keys(results).forEach((i) => {
            const index = Number(i)

            if (check(index, results)) {
                tmpScore++
            }
        })

        setScore(tmpScore)
        setWrong(total - tmpScore)
        setPercent(total ? Math.round((tmpScore / total) * 100) : 0)
    }, [])

    useEffect(() => {
        if (!shareModalOpen) return

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setShareModalOpen(false)
                setCopyFeedback('')
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [shareModalOpen])

    function openShareModal() {
        setCopyFeedback('')
        setShareModalOpen(true)
    }

    async function copyShareText() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url)
            } else {
                // Fallback for browsers without Clipboard API access.
                const textArea = document.createElement('textarea')
                textArea.value = url
                textArea.setAttribute('readonly', '')
                textArea.style.position = 'fixed'
                textArea.style.opacity = '0'
                textArea.style.pointerEvents = 'none'

                document.body.appendChild(textArea)
                textArea.select()

                const copied = document.execCommand('copy')
                document.body.removeChild(textArea)

                if (!copied) {
                    throw new Error('Copy command failed')
                }
            }

            setCopyFeedback('Copied to clipboard!')
        } catch {
            setCopyFeedback('Could not copy automatically. Please select and copy the text.')
        }
    }

    function closeShareModal() {
        setShareModalOpen(false)
        setCopyFeedback('')
    }

    return (
        <>
            <main className="main">
                <header className="head section">
                    <div className="score-container heading">
                        <span className="subtext">Your Score</span>
                        <p className="score">{percent}%</p>
                        <span className="subtext">
                            {score} out of {total} correct
                        </span>
                    </div>

                    <div className="actions">
                        <button
                            className="button button-primary"
                            onClick={() => {
                                localStorage.setItem('answers', '{}')
                                localStorage.setItem('number', 0)
                                navigate('/quiz')
                            }}
                        >
                            Try again
                        </button>

                        <button
                            className="button"
                            onClick={() => {
                                localStorage.setItem('answers', '{}')
                                navigate('/')
                            }}
                        >
                            Change Settings
                        </button>

                        <button
                            className="button share-button"
                            onClick={openShareModal}
                        >
                            Share results
                        </button>
                    </div>
                </header>

                <section className="section body">
                    <div className="results-nav">
                        <p className="nav-head">Review your answers</p>

                        <div className="tabs">
                            <span
                                className={`tab ${tab === 'all' ? 'active-tab' : ''}`}
                                onClick={() => setTab('all')}
                            >
                                All {total}
                            </span>

                            <span
                                className={`tab ${tab === 'correct' ? 'active-tab' : ''}`}
                                onClick={() => setTab('correct')}
                            >
                                Correct {score}
                            </span>

                            <span
                                className={`tab ${tab === 'wrong' ? 'active-tab' : ''}`}
                                onClick={() => setTab('wrong')}
                            >
                                Wrong {wrong}
                            </span>
                        </div>
                    </div>

                    <div className="questions">
                        {questions.map((quest, index) => {
                            const ans = quest.answer
                            const pick = quest.options[results[index]]
                            const correct = ans === pick

                            const render =
                                tab === 'all' ||
                                (tab === 'wrong' && !correct) ||
                                (tab === 'correct' && correct)

                            if (!render) return null

                            return (
                                <div key={index} className="result">
                                    <p className="quest">
                                        {index + 1}. {quest.question}
                                    </p>

                                    <p className={`pick ${!correct ? 'wrong' : ''}`}>
                                        Your answer: {pick ?? 'No answer selected'}
                                    </p>

                                    {!correct && (
                                        <p>Correct answer: {ans}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            </main>

            {shareModalOpen && (
                <div
                    className="share-modal-overlay"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            closeShareModal()
                        }
                    }}
                >
                    <section
                        className="share-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="share-modal-title"
                    >
                        <div className="share-modal-header">
                            <h2
                                className="share-modal-title"
                                id="share-modal-title"
                            >
                                Share your results
                            </h2>

                            <button
                                type="button"
                                className="share-modal-close"
                                onClick={closeShareModal}
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="share-modal-description">
                            Copy th link below to share
                        </p>

                        <span>{url}</span>

                        <div className="share-modal-footer">
                            <button
                                type="button"
                                className="button"
                                onClick={closeShareModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="button button-primary"
                                onClick={copyShareText}
                            >
                                Copy
                            </button>
                        </div>

                        {copyFeedback && (
                            <p className="copy-feedback" role="status">
                                {copyFeedback}
                            </p>
                        )}
                    </section>
                </div>
            )}
        </>
    )
}
